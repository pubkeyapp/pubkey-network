import { Injectable } from '@nestjs/common'
import { ApiCoreService } from '@pubkey-network/api-core-data-access'
import { ApiSolanaService } from '@pubkey-network/api-solana-data-access'
import { PUBKEY_PROFILE_PROGRAM_ID, PubKeyIdentityProvider, PubKeyProfile } from '@pubkey-program-library/anchor'
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js'
import { LocalPubKeyProfileSdk } from './local-pubkey-profile-sdk'

@Injectable()
export class ApiProfileService {
  private readonly sdk: LocalPubKeyProfileSdk
  private readonly feePayer: Keypair

  constructor(private readonly core: ApiCoreService, private readonly solana: ApiSolanaService) {
    this.feePayer = this.core.config.solanaFeePayer
    this.sdk = new LocalPubKeyProfileSdk({
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
    const authorityIdentity = user.identities.find((identity) => identity.providerId === publicKey)
    if (!authorityIdentity) {
      throw new Error('Solana identity not found')
    }

    const authority = parseSolanaPublicKey(authorityIdentity.providerId)
    if (!authority) {
      throw new Error('Invalid Solana public key')
    }
    const ix = await this.sdk
      .createProfile({
        username: user.username,
        avatarUrl: user.avatarUrl ?? '',
        feePayer: this.feePayer,
        authority: authority,
      })
      .instruction()

    const { blockhash, lastValidBlockHeight } = await this.solana.connection.getLatestBlockhash()

    const transactionMessage = new TransactionMessage({
      instructions: [ix],
      payerKey: this.feePayer.publicKey,
      recentBlockhash: blockhash,
    }).compileToV0Message()

    const transaction = new VersionedTransaction(transactionMessage)
    // transaction.sign([this.feePayer])

    const sig = await this.solana.sendAndConfirmTransaction({
      transaction,
      blockhash,
      lastValidBlockHeight,
    })

    console.log(`sig`, sig)

    return transaction.serialize()
  }

  async getUserProfile(userId: string) {
    const user = await this.core.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const [profileByUsername, ...profileByIdentities] = await Promise.all([
      this.getUserProfileByUsername(user.username),
      ...user.identities.map((identity) =>
        this.getUserProfileByProvider(identity.provider as PubKeyIdentityProvider, identity.providerId),
      ),
    ])

    return {
      userId,
      profileByUsername,
      profileByIdentities,
    }
  }

  async getUserProfileByUsername(username: string): Promise<PubKeyProfile | null> {
    try {
      return this.sdk.getProfileByUsername({ username })
    } catch (e) {
      return null
    }
  }

  async getUserProfileByProvider(provider: PubKeyIdentityProvider, providerId: string): Promise<PubKeyProfile | null> {
    try {
      return this.sdk.getProfileByProvider({ provider, providerId })
    } catch (e) {
      return null
    }
  }

  getUserProfiles() {
    return this.sdk.getProfiles()
  }
}

function parseSolanaPublicKey(publicKey: string): PublicKey | null {
  try {
    return new PublicKey(publicKey)
  } catch (e) {
    return null
  }
}
