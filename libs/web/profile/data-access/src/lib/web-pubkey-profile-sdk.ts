import { AnchorProvider, Program } from '@coral-xyz/anchor'
import {
  getPubKeyPointerPda,
  getPubKeyProfilePda,
  PUBKEY_PROFILE_PROGRAM_ID,
  PubKeyIdentityProvider,
  PubKeyPointer,
  PubkeyProfile,
  PubKeyProfile,
  PubkeyProfileIDL,
} from '@pubkey-program-library/anchor'
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'

export interface PubKeyProfileSdkOptions {
  readonly connection: Connection
  readonly programId?: PublicKey
  readonly provider: AnchorProvider
}

export interface GetPointerPdaOptions {
  provider: PubKeyIdentityProvider
  providerId: string
}

export interface GetProfilePdaOptions {
  username: string
}

export interface GetProfileByProvider {
  provider: PubKeyIdentityProvider
  providerId: string
}

export interface GetProfileByUsername {
  username: string
}

export interface AddIdentityOptions {
  authority: PublicKey
  feePayer: Keypair
  username: string
  providerId: string
  provider: PubKeyIdentityProvider
  nickname: string
}

export interface RemoveIdentityOptions {
  authority: PublicKey
  feePayer: Keypair
  username: string
  providerId: string
  provider: PubKeyIdentityProvider
}

export interface RemoveAuthorityOptions {
  authorityToRemove: PublicKey
  authority: PublicKey
  feePayer: Keypair
  username: string
}

export interface AddAuthorityOptions {
  newAuthority: PublicKey
  authority: PublicKey
  feePayer: Keypair
  username: string
}

export interface CreateProfileOptions {
  avatarUrl: string
  authority: PublicKey
  feePayer: PublicKey
  username: string
}

export interface UpdateAvatarUrlOptions {
  avatarUrl: string
  authority: PublicKey
  feePayer: Keypair
  username: string
}

export class WebPubKeyProfileSdk {
  private readonly connection: Connection
  private readonly program: Program<PubkeyProfile>
  private readonly provider: AnchorProvider
  readonly programId: PublicKey

  constructor(options: PubKeyProfileSdkOptions) {
    this.connection = options.connection
    this.provider = options.provider
    this.programId = options.programId || PUBKEY_PROFILE_PROGRAM_ID
    this.program = new Program(PubkeyProfileIDL, this.programId, this.provider)
  }

  async addAuthority({ newAuthority, authority, feePayer, username }: AddAuthorityOptions) {
    const [profile] = this.getProfilePda({ username })

    return this.program.methods.addAuthority({ newAuthority }).accounts({
      authority,
      feePayer: feePayer.publicKey,
      profile,
      systemProgram: SystemProgram.programId,
    })
  }

  async addIdentity({ authority, feePayer, username, providerId, provider, nickname }: AddIdentityOptions) {
    const [profile] = this.getProfilePda({ username })
    const [pointer] = this.getPointerPda({ providerId, provider })

    return this.program.methods
      .addIdentity({
        nickname,
        provider: convertFromIdentityProvider(provider),
        providerId,
      })
      .accounts({
        authority,
        feePayer: feePayer.publicKey,
        profile,
        pointer,
        systemProgram: SystemProgram.programId,
      })
  }

  async createProfile({ authority, avatarUrl, feePayer, username }: CreateProfileOptions) {
    const [profile] = this.getProfilePda({ username })
    const [pointerPda] = this.getPointerPda({
      provider: PubKeyIdentityProvider.Solana,
      providerId: authority.toString(),
    })

    const found = await this.getPointerNullable({ pointerPda })

    if (found) {
      throw new Error('Pointer already exists')
    }

    const { blockhash } = await this.connection.getLatestBlockhash()

    const ix = await this.program.methods
      .createProfile({ avatarUrl, username })
      .accounts({
        authority,
        feePayer,
        pointer: pointerPda,
        profile,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const transactionMessage = new TransactionMessage({
      instructions: [ix],
      payerKey: feePayer,
      recentBlockhash: blockhash,
    }).compileToV0Message()

    return new VersionedTransaction(transactionMessage)
  }

  async getProfiles(): Promise<PubKeyProfile[]> {
    return this.program.account.profile.all().then((accounts) =>
      accounts.map(({ account, publicKey }) => ({
        publicKey,
        authorities: account.authorities,
        avatarUrl: account.avatarUrl,
        bump: account.bump,
        identities: account.identities.map((identity) => ({
          ...identity,
          provider: convertToIdentityProvider(identity.provider as unknown as { [key: string]: object }),
        })),
        feePayer: account.feePayer,
        username: account.username,
      })),
    )
  }

  async getPointers(): Promise<PubKeyPointer[]> {
    return this.program.account.pointer.all().then((accounts) =>
      accounts.map(({ account, publicKey }) => ({
        publicKey,
        provider: convertToIdentityProvider(account.provider as unknown as { [key: string]: object }),
        providerId: account.providerId,
        bump: account.bump,
        profile: account.profile,
      })),
    )
  }

  async getProfileByProvider({ provider, providerId }: GetProfileByProvider): Promise<PubKeyProfile> {
    const [pointerPda] = this.getPointerPda({ provider, providerId })

    const { profile } = await this.getPointer({ pointerPda })

    return this.getProfile({ profilePda: profile })
  }

  async getProfileByUsername({ username }: GetProfileByUsername): Promise<PubKeyProfile> {
    const [profilePda] = this.getProfilePda({ username })

    return this.getProfile({ profilePda })
  }

  async getProfile({ profilePda }: { profilePda: PublicKey }): Promise<PubKeyProfile> {
    return this.program.account.profile.fetch(profilePda).then((res) => {
      const identities = res.identities.map((identity) => ({
        ...identity,
        provider: convertToIdentityProvider(identity.provider as unknown as { [key: string]: never }),
      }))

      return {
        ...res,
        publicKey: profilePda,
        identities,
      }
    })
  }

  async getPointer({ pointerPda }: { pointerPda: PublicKey }) {
    return this.program.account.pointer.fetch(pointerPda)
  }
  async getPointerNullable({ pointerPda }: { pointerPda: PublicKey }) {
    return this.program.account.pointer.fetchNullable(pointerPda)
  }

  async getProgramAccount() {
    return this.connection.getParsedAccountInfo(this.programId)
  }

  getProfilePda({ username }: GetProfilePdaOptions): [PublicKey, number] {
    return getPubKeyProfilePda({ programId: this.programId, username })
  }

  getPointerPda({ provider, providerId }: GetPointerPdaOptions): [PublicKey, number] {
    return getPubKeyPointerPda({ programId: this.programId, providerId, provider })
  }

  async removeAuthority({ authorityToRemove, authority, feePayer, username }: RemoveAuthorityOptions) {
    const [profile] = this.getProfilePda({ username })

    return this.program.methods
      .removeAuthority({ authorityToRemove })
      .accounts({ authority, feePayer: feePayer.publicKey, profile })
  }

  async removeIdentity({ authority, feePayer, username, providerId, provider }: RemoveIdentityOptions) {
    const [profile] = this.getProfilePda({ username })
    const [pointer] = this.getPointerPda({ providerId, provider })
    return this.program.methods.removeIdentity({ providerId }).accounts({
      authority,
      feePayer: feePayer.publicKey,
      pointer,
      profile,
      systemProgram: SystemProgram.programId,
    })
  }

  async updateAvatarUrl({ avatarUrl, authority, feePayer, username }: UpdateAvatarUrlOptions) {
    const [profile] = this.getProfilePda({ username })

    return this.program.methods
      .updateAvatarUrl({ newAvatarUrl: avatarUrl, authority })
      .accounts({ feePayer: feePayer.publicKey, profile })
  }
}

export const enumMap = {
  [PubKeyIdentityProvider.Solana]: { solana: {} },
  [PubKeyIdentityProvider.Discord]: { discord: {} },
} as const

export function convertFromIdentityProvider(provider: PubKeyIdentityProvider) {
  if (!enumMap[provider]) {
    throw new Error(`Unknown provider: ${provider}`)
  }
  return enumMap[provider]
}

export function convertToIdentityProvider(provider: { [key: string]: object }): PubKeyIdentityProvider {
  const key = Object.keys(provider)[0]

  const found: string | undefined = Object.keys(PubKeyIdentityProvider).find(
    (provider) => provider.toLowerCase() === key,
  )

  if (!found) {
    throw new Error(`Unknown provider: ${key}`)
  }

  return PubKeyIdentityProvider[found as keyof typeof PubKeyIdentityProvider]
}
