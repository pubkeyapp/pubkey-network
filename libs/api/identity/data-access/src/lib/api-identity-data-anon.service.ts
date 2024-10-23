import { Injectable, Logger } from '@nestjs/common'
import { Identity, IdentityProvider, User, UserRole, UserStatus } from '@prisma/client'
import { ApiAuthService } from '@pubkey-network/api-auth-data-access'
import {
  ApiCoreService,
  BaseContext,
  ellipsify,
  getRequestDetails,
  slugifyId,
} from '@pubkey-network/api-core-data-access'
import { PubKeyProfile } from '@pubkey-protocol/sdk'
import { ApiIdentitySolanaService } from './api-identity-solana.service'
import { IdentityRequestChallengeInput } from './dto/identity-request-challenge-input'
import { IdentityVerifyChallengeInput } from './dto/identity-verify-challenge-input'
import { sha256 } from './helpers/sha256'

export type IdentityWithOwner = Identity & { owner?: User }

@Injectable()
export class ApiIdentityDataAnonService {
  private readonly logger = new Logger(ApiIdentityDataAnonService.name)
  constructor(
    private readonly auth: ApiAuthService,
    private readonly core: ApiCoreService,
    private readonly solana: ApiIdentitySolanaService,
  ) {}

  async requestIdentityChallenge(ctx: BaseContext, { provider, providerId }: IdentityRequestChallengeInput) {
    // Make sure we can link the given provider
    this.solana.ensureLinkProvider(provider)

    // Make sure the providerId is valid
    this.solana.ensureValidProviderId(provider, providerId)

    // Check if we already have an identity for this provider
    const { identity, profile, avatarUrl, username } = await this.getIdentityProfile(provider, providerId)

    // Get the IP and user agent from the request
    const { ip, userAgent } = getRequestDetails(ctx)

    // Generate a random challenge
    const challenge = sha256(`${Math.random()}-${ip}-${userAgent}-${provider}-${providerId}-${Math.random()}`)
    const admin = this.core.config.isAdminId(IdentityProvider.Solana, providerId)

    // Store the challenge
    return this.core.data.identityChallenge.create({
      data: {
        identity: {
          connectOrCreate: {
            where: { provider_providerId: { provider, providerId } },
            create: {
              provider,
              providerId,
              verified: false,
              owner: {
                create: {
                  username,
                  name: username,
                  avatarUrl,
                  profile: profile?.publicKey?.toString(),
                  role: admin ? UserRole.Admin : UserRole.User,
                  status: UserStatus.Active,
                  developer: admin,
                },
              },
            },
          },
        },
        ip,
        userAgent,
        challenge: `Approve this message ${
          identity?.owner ? `sign in as ${username}` : 'sign up for a new account'
        }. #REF-${challenge}`,
      },
    })
  }

  private async getIdentityProfile(
    provider: IdentityProvider,
    providerId: string,
  ): Promise<{
    identity: IdentityWithOwner | null
    profile: PubKeyProfile | null
    avatarUrl: string | undefined
    username: string
  }> {
    const [identity, profile] = await Promise.all([
      this.solana.findIdentity(provider, providerId),
      this.solana.findPubKeyProfile(provider, providerId),
    ])

    let avatarUrl = undefined
    let username = ''

    if (identity?.owner && profile) {
      if (profile.username !== identity?.owner?.username) {
        console.log({
          profileUsername: profile.username,
          identityOwnerUsername: identity?.owner?.username,
        })
        this.logger.warn(`Re-syncing profile username: ${identity?.owner?.username} => ${profile.username}`)
        await this.core.data.user.update({
          where: { id: identity?.owner?.id },
          data: {
            username: profile.username,
            // TODO: Fix: once we have a name property on the PubKeyProfile
            name: profile.username,
            avatarUrl: profile.avatarUrl,
          },
        })
      }
      avatarUrl = profile.avatarUrl
      username = profile.username
    }

    // PubKey Profile is found, identity does not exist.
    if (!identity && profile) {
      avatarUrl = profile.avatarUrl ?? undefined
      username = profile.username
    }

    // Nothing is found, total new user.
    if (!identity && !profile) {
      avatarUrl = undefined
      username = slugifyId(`${ellipsify(providerId)}-${provider}`)
    }

    return {
      identity,
      profile,
      avatarUrl,
      username,
    }
  }

  async verifyIdentityChallenge(
    ctx: BaseContext,
    { provider, providerId, challenge, signature, useLedger }: IdentityVerifyChallengeInput,
  ) {
    // Make sure we can link the given provider
    this.solana.ensureLinkProvider(provider)
    // Make sure the providerId is valid
    this.solana.ensureValidProviderId(provider, providerId)

    // Ensure the signature is valid
    const { found, verified } = await this.solana.ensureValidSignature(
      ctx,
      provider,
      providerId,
      challenge,
      signature,
      useLedger,
    )

    if (!found.identity.verified) {
      // Update the identity
      await this.core.data.identity.update({
        where: { id: found.identity.id },
        data: { verified: true },
      })
      this.logger.log(`Identity ${found.identity.id} verified`)
    }

    // Update the identity
    const updated = await this.core.data.identityChallenge.update({
      where: {
        id: found.id,
      },
      data: {
        verified,
        signature,
      },
      include: { identity: { include: { owner: true } } },
    })

    if (updated.identity.owner.status !== UserStatus.Active) {
      await this.core.data.user.update({
        where: { id: updated.identity.owner.id },
        data: { status: UserStatus.Active },
      })
      this.logger.log(`User ${updated.identity.owner.id} activated`)
    }

    if (updated.verified) {
      this.logger.verbose(
        `Identity challenge ${updated.id} verified, signing in user ${updated.identity.owner.username} (${updated.identity.owner.id})`,
      )
      this.auth.signAndSetCookie(ctx, { username: updated.identity.owner.username, id: updated.identity.owner.id })
    }
    return updated
  }
}
