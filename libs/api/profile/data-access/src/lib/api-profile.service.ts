import { Injectable, NotFoundException } from '@nestjs/common'
import { Identity, IdentityProvider } from '@prisma/client'
import { ApiCoreService } from '@pubkey-network/api-core-data-access'
import { ApiSolanaService } from '@pubkey-network/api-solana-data-access'
import { PUBKEY_PROFILE_PROGRAM_ID, PubKeyIdentityProvider, PubKeyProfile } from '@pubkey-program-library/anchor'
import { PubKeyProfileSdk } from '@pubkey-program-library/sdk'
import { Keypair, PublicKey } from '@solana/web3.js'

@Injectable()
export class ApiProfileService {
  private readonly sdk: PubKeyProfileSdk
  private readonly feePayer: Keypair
  private readonly validProviders: PubKeyIdentityProvider[] = [
    // Add more providers here once the protocol supports them
    PubKeyIdentityProvider.Discord,
    PubKeyIdentityProvider.Github,
    PubKeyIdentityProvider.Google,
    PubKeyIdentityProvider.Solana,
    PubKeyIdentityProvider.Twitter,
  ]

  constructor(private readonly core: ApiCoreService, private readonly solana: ApiSolanaService) {
    this.feePayer = this.core.config.solanaFeePayer
    this.sdk = new PubKeyProfileSdk({
      connection: this.solana.connection,
      provider: this.solana.getAnchorProvider(this.feePayer),
      programId: PUBKEY_PROFILE_PROGRAM_ID,
    })
  }

  async createUserProfile(userId: string, publicKey: string) {
    const user = await this.core.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    const authority = ensureAuthority(user.identities, publicKey)

    const transaction = await this.sdk.createProfile({
      username: user.username,
      avatarUrl: user.avatarUrl ?? '',
      feePayer: this.feePayer.publicKey,
      authority,
    })

    return transaction.serialize()
  }

  getApiUrl(path: string) {
    return `${this.core.config.apiUrl}${path}`
  }

  async profileIdentityAdd(userId: string, publicKey: string, identityProvider: IdentityProvider, providerId: string) {
    const provider = convertToPubKeyIdentityProvider(identityProvider)
    this.ensureValidProvider(provider)
    const { user, profile } = await this.ensureUserProfile(userId)

    const existing = profile.identities.find((i) => i.providerId === providerId && i.provider === provider)
    if (existing) {
      throw new Error(`Identity ${provider} ${providerId} already linked`)
    }

    // Make sure the provider and providerId are owned by the user
    const identity = await ensureUserIdentity(user.identities, identityProvider, providerId)

    const authority = ensureAuthority(user.identities, publicKey)

    const nickname =
      (identity.profile as { username?: string })?.username ??
      (identity.profile as { name?: string })?.name ??
      identity.name ??
      identity.providerId

    const transaction = await this.sdk.addIdentity({
      authority,
      feePayer: this.feePayer.publicKey,
      username: user.username,
      provider,
      providerId,
      nickname,
    })
    transaction.sign([this.feePayer])

    return transaction.serialize()
  }

  async profileIdentityRemove(
    userId: string,
    publicKey: string,
    identityProvider: IdentityProvider,
    providerId: string,
  ) {
    const provider = convertToPubKeyIdentityProvider(identityProvider)
    this.ensureValidProvider(provider)
    const { user, profile } = await this.ensureUserProfile(userId)

    const existing = profile.identities.find((i) => i.providerId === providerId && i.provider === provider)

    if (!existing) {
      throw new Error(`Identity ${provider} ${providerId} not linked`)
    }

    // Make sure the provider and providerId are owned by the user
    const identity = user.identities.find((i) => i.provider === identityProvider && i.providerId === providerId)

    if (!identity) {
      throw new Error(`Identity ${provider} ${providerId} not found`)
    }

    const authority = ensureAuthority(user.identities, publicKey)

    const transaction = await this.sdk.removeIdentity({
      authority,
      feePayer: this.feePayer.publicKey,
      username: user.username,
      provider,
      providerId,
    })
    transaction.sign([this.feePayer])

    return transaction.serialize()
  }

  async checkUserProfile(userId: string) {
    const { user, profile } = await this.ensureUserProfile(userId)

    const userIdentities = user.identities.map((i) => ({ provider: i.provider.toString(), providerId: i.providerId }))

    const profileIdentities = profile.identities.map((i) => ({
      provider: i.provider.toString(),
      providerId: i.providerId,
    }))

    const diffIdentities = diffProfileIdentities(userIdentities, profileIdentities)
    console.log('diffIdentities', diffIdentities)

    try {
      const current = await this.getUserProfile(userId)
      console.log(`current`, current)
    } catch (e) {
      console.log('error', e)
      return
    }

    return {
      user,
      current: 'current' ?? { current: '' },
    }
  }

  async syncUserProfile(userId: string) {
    const { user, profile } = await this.ensureUserProfile(userId)

    console.log({ user, profile })
    const userIdentities = user.identities.map((i) => ({ provider: i.provider.toString(), providerId: i.providerId }))

    const diffProfile = diffProfileDetails(
      { avatarUrl: 'a', username: user?.username },
      { avatarUrl: 'a', username: profile?.username },
    )

    if (Object.values(diffProfile).filter(Boolean).length) {
      console.log('profile changes', diffProfile)
    }

    const diffIdentities = diffProfileIdentities(
      userIdentities,
      profile.identities.map((i) => ({
        provider: i.provider.toString(),
        providerId: i.providerId,
      })),
    )
    console.log('diffIdentities', diffIdentities)

    try {
      const current = await this.getUserProfile(userId)
      console.log(`current`, current)
    } catch (e) {
      console.log('error', e)
      return
    }

    return {
      user,
      current: 'current' ?? { current: '' },
    }
  }

  getProviders() {
    return this.validProviders
  }

  async getUserProfile(userId: string): Promise<PubKeyProfile | null> {
    const user = await this.core.getUserById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return this.sdk.getProfileByUsernameNullable({ username: user.username })
  }

  async getUserProfileByUsername(username: string): Promise<PubKeyProfile | null> {
    this.ensureValidUsername(username)

    try {
      return await this.sdk.getProfileByUsernameNullable({ username })
    } catch (e) {
      throw new NotFoundException(`User profile not found for username ${username}`)
    }
  }

  async getUserProfileByProvider(provider: PubKeyIdentityProvider, providerId: string): Promise<PubKeyProfile | null> {
    try {
      this.ensureValidProvider(provider)
    } catch (e) {
      throw new NotFoundException(`Invalid provider, must be one of ${this.validProviders.join(', ')}`)
    }

    try {
      this.ensureValidProviderId(provider, providerId)
    } catch (e) {
      throw new NotFoundException(`Invalid provider ID for provider ${provider}`)
    }
    try {
      return await this.sdk.getProfileByProviderNullable({ provider, providerId })
    } catch (e) {
      throw new NotFoundException(`User profile not found for provider ${provider} and providerId ${providerId}`)
    }
  }

  async getUserProfileByProviderNullable(
    provider: IdentityProvider,
    providerId: string,
  ): Promise<PubKeyProfile | null> {
    try {
      return await this.sdk.getProfileByProviderNullable({
        provider: convertToPubKeyIdentityProvider(provider),
        providerId,
      })
    } catch (e) {
      return null
    }
  }

  async getUserProfiles(): Promise<PubKeyProfile[]> {
    return this.sdk.getProfiles().then((res) => res.sort((a, b) => a.username.localeCompare(b.username)))
  }

  private async ensureUserProfile(userId: string) {
    const user = await this.core.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const publicKeys: string[] = user.identities
      .filter((i) => i.provider === IdentityProvider.Solana)
      .map((i) => i.providerId)
    const profile = await this.findProfile({ username: user.username, publicKeys })
    if (!profile) {
      throw new Error('User profile not found')
    }

    return { user, profile }
  }

  private async findProfile({ username, publicKeys }: { username: string; publicKeys: string[] }) {
    const profile = await this.sdk.getProfileByUsernameNullable({ username })

    if (profile) {
      console.log(`No profile found`)
      return profile
    }

    const profiles = await Promise.all(
      publicKeys.map((providerId) => {
        console.log(` -> Searching ${providerId}`)
        return this.sdk.getProfileByProviderNullable({
          provider: PubKeyIdentityProvider.Solana,
          providerId,
        })
      }),
    )

    if (profiles?.length === 1) {
      return profiles[0]
    }

    if (profiles.length > 1) {
      throw new Error('TODO: handle case with multiple profiles')
    }
    throw new Error('User profile not found')
  }

  private ensureValidProvider(provider: PubKeyIdentityProvider) {
    if (!this.validProviders.includes(provider)) {
      throw new Error(`Invalid provider: ${provider}`)
    }
  }

  private ensureValidProviderId(provider: PubKeyIdentityProvider, providerId: string) {
    if (provider === PubKeyIdentityProvider.Solana && !isSolanaPublicKey(providerId)) {
      throw new Error(`Invalid provider ID for ${provider}.`)
    }
    if (provider !== PubKeyIdentityProvider.Solana && !isNumericString(providerId)) {
      throw new Error(`Invalid provider ID for ${provider}.`)
    }
  }

  private ensureValidUsername(username: string) {
    if (!isValidUsername(username)) {
      throw new NotFoundException(`Invalid username: ${username}`)
    }
  }
}

function isNumericString(str: string): boolean {
  return /^\d+$/.test(str)
}

function isSolanaPublicKey(str: string): boolean {
  return !!parseSolanaPublicKey(str)
}
function isValidUsername(username: string): boolean {
  if (username.length < 3 || username.length > 20) {
    return false
  }

  if (!username.split('').every((c) => /^[a-z0-9_]$/.test(c))) {
    return false
  }

  return true
}
function parseSolanaPublicKey(publicKey: string): PublicKey | null {
  try {
    return new PublicKey(publicKey)
  } catch (e) {
    return null
  }
}

function ensureAuthority(identities: Identity[], publicKey: string) {
  const authorityIdentity = identities.find((identity) => identity.providerId === publicKey)
  if (!authorityIdentity) {
    throw new Error('Solana identity not found')
  }

  const authority = parseSolanaPublicKey(authorityIdentity.providerId)
  if (!authority) {
    throw new Error('Invalid Solana public key')
  }

  return authority
}

async function ensureUserIdentity(identities: Identity[], provider: IdentityProvider, providerId: string) {
  const identity = identities.find((i) => i.provider === provider && i.providerId === providerId)

  if (!identity) {
    throw new Error(`Identity ${provider} ${providerId} not found`)
  }

  return identity
}

function diffProfileIdentities(
  userIdentities: Array<{ provider: string; providerId: string }>,
  profileIdentities: Array<{ provider: string; providerId: string }>,
): Array<{ provider: string; providerId: string }> {
  return userIdentities.filter(
    (i) => !profileIdentities.some((p) => p.provider === i.provider && p.providerId === i.providerId),
  )
}

function diffProfileDetails(
  left: { avatarUrl?: string; username?: string },
  right: { avatarUrl?: string; username?: string },
): { avatarUrl?: string; username?: string } {
  return {
    avatarUrl: left?.avatarUrl !== right?.avatarUrl ? right?.avatarUrl : undefined,
    username: left?.username !== right?.username ? right?.username : undefined,
  }
}

export function convertToPubKeyIdentityProvider(provider: IdentityProvider): PubKeyIdentityProvider {
  switch (provider.toString()) {
    case 'Discord':
      return PubKeyIdentityProvider.Discord
    case 'GitHub':
      return PubKeyIdentityProvider.Github
    case 'Google':
      return PubKeyIdentityProvider.Google
    case 'Solana':
      return PubKeyIdentityProvider.Solana
    case 'Twitter':
      return PubKeyIdentityProvider.Twitter
    default:
      throw new Error(`Invalid provider: ${provider}`)
  }
}
