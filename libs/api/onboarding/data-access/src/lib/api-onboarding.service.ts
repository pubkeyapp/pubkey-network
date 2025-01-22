import { Injectable, Logger } from '@nestjs/common'
import { IdentityProvider } from '@prisma/client'
import { ApiCoreService, ellipsify } from '@pubkey-network/api-core-data-access'
import { ApiProtocolService } from '@pubkey-network/api-protocol-data-access'
import { OnboardingStep } from './entity/onboarding-step'
import { OnboardingRequirements } from './entity/onboarding.entity'

@Injectable()
export class ApiOnboardingService {
  readonly socialProviders = [
    IdentityProvider.Discord,
    IdentityProvider.Github,
    IdentityProvider.Google,
    // IdentityProvider.Telegram,
    IdentityProvider.X,
  ]

  private readonly logger = new Logger(ApiOnboardingService.name)
  constructor(private readonly core: ApiCoreService, private readonly protocol: ApiProtocolService) {}

  async getOnboardingUsernames(userId: string) {
    const user = await this.core.ensureUserById(userId)
    const rawUsernames = user.identities
      .filter((i) => i?.profile)
      .map((i) => i.profile as { username?: string })
      // Remove any identities that don't have a username
      .filter((i) => i.username)
      // Take the username property
      .map((i) => i.username as string)

    const usernames = cleanupUsernames(rawUsernames)

    // For all usernames with an underscore, also offer the username without the underscore
    for (const username of usernames) {
      if (username.includes('_')) {
        usernames.push(username.replace('_', ''))
      }
    }

    // Remove any duplicates and sort the usernames
    const sortedUsernames = Array.from(new Set(usernames)).sort()

    // Create usernames based on Solana wallets for users that like to be pseudonymous
    const wallets = user.identities
      // Remove any identities that are not Solana wallets
      .filter((i) => i?.provider === IdentityProvider.Solana)
      // Take the providerId property
      .map((i) => i.providerId as string)
      // Convert any special characters to lowercase
      .map((i) => ellipsify(i, 4, '__').toLowerCase())

    // Remove any duplicates and sort the wallets
    const sortedWallets = Array.from(new Set(wallets)).sort()

    return [...sortedUsernames, ...sortedWallets]
  }

  async getOnboardingAvatarUrls(userId: string) {
    const user = await this.core.ensureUserById(userId)
    const usernames: string[] = []

    const avatarUrls = user.identities
      .filter((i) => i?.profile)
      .map((i) => i.profile as { avatarUrl?: string; username?: string })
      .map((i) => {
        // Collect any usernames
        if (i.username) {
          usernames.push(i.username)
        }
        return i
      })
      // Remove any identities that don't have a avatarUrl
      .filter((i) => i.avatarUrl)
      // Take the avatarUrl property
      .map((i) => i.avatarUrl as string)

    const cleaned = cleanupUsernames(usernames)

    for (const username of cleaned) {
      avatarUrls.push(
        `https://api.dicebear.com/9.x/avataaars/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${username}`,
      )
      avatarUrls.push(`https://api.dicebear.com/9.x/initials/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${username}`)
    }

    // Remove any duplicates and sort the avatarUrls
    return Array.from(new Set(avatarUrls))
  }

  async getOnboardingRequirements(userId: string): Promise<OnboardingRequirements> {
    const user = await this.core.ensureUserById(userId)

    const [usernames, avatarUrls] = await Promise.all([
      this.getOnboardingUsernames(userId),
      this.getOnboardingAvatarUrls(userId),
    ])

    const socialIdentities = user.identities.filter((i) => identityProvidersSocial.includes(i?.provider))
    const solanaIdentities = user.identities.filter((i) => i?.provider === IdentityProvider.Solana)
    const validAvatarUrl = avatarUrls.includes(user.avatarUrl ?? '')
    const validUsername = usernames.includes(user.username)
    const profileAccount = user.profile ?? null

    let step: OnboardingStep

    if (!socialIdentities.length) {
      step = OnboardingStep.LinkSocialIdentities
    } else if (!solanaIdentities.length) {
      step = OnboardingStep.LinkSolanaWallets
    } else if (!validAvatarUrl || !validUsername) {
      step = OnboardingStep.CustomizeProfile
    } else if (!user.profile) {
      step = OnboardingStep.CreateProfile
    } else {
      step = OnboardingStep.Finished
    }

    return {
      profileAccount,
      socialIdentities: socialIdentities.length ?? 0,
      solanaIdentities: solanaIdentities.length ?? 0,
      validAvatarUrl: avatarUrls.includes(user.avatarUrl ?? ''),
      validUsername: usernames.includes(user.username),
      step,
    }
  }

  async createProfile(userId: string, publicKey: string) {
    const user = await this.core.ensureUserById(userId)
    const requirementsMet = await this.getOnboardingRequirements(user.id)
    if (!requirementsMet) {
      throw new Error(`User ${user.id} has not met the onboarding requirements`)
    }

    return this.protocol.createUserProfile(user.id, publicKey)
  }

  async customizeProfile(userId: string, username: string, avatarUrl: string) {
    const user = await this.core.ensureUserById(userId)
    const [usernames, avatarUrls] = await Promise.all([
      this.getOnboardingUsernames(user.id),
      this.getOnboardingAvatarUrls(user.id),
    ])

    if (!usernames.includes(username)) {
      throw new Error(`User ${user.username} has not met the onboarding requirements`)
    }

    if (!avatarUrls.includes(avatarUrl)) {
      throw new Error(`User ${user.username} has not met the onboarding requirements`)
    }

    try {
      const updated = await this.core.updateUserById(user.id, { username, avatarUrl })
      this.logger.log(`User ${user.username} has been updated to ${updated.username} and ${updated.avatarUrl}`)
      return true
    } catch (error) {
      console.error(error)
      throw new Error(`User ${user.username} could not be updated`)
    }
  }
}

const identityProvidersSocial: IdentityProvider[] = [
  IdentityProvider.Discord,
  IdentityProvider.Github,
  IdentityProvider.Google,
  IdentityProvider.Telegram,
  IdentityProvider.X,
]

function cleanupUsernames(usernames: string[]) {
  return (
    usernames // Take the first part of any email addresses
      .map((i) => i?.split('@')[0])
      // Convert any special characters to lowercase
      .map((i) => i.replace(/[^a-z0-9]/gi, '_').toLowerCase())
  )
}
