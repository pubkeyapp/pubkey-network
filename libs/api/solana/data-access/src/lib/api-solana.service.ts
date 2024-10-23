import { AnchorProvider } from '@coral-xyz/anchor'
import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ApiCoreService, CORE_APP_STARTED } from '@pubkey-network/api-core-data-access'
import { AnchorKeypairWallet } from '@pubkey-protocol/sdk'
import { getMint, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { TokenMetadata } from '@solana/spl-token-metadata'
import {
  AccountInfo,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  ParsedAccountData,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js'

export type SolanaAccountInfo = AccountInfo<ParsedAccountData>

@Injectable()
export class ApiSolanaService {
  private readonly logger = new Logger(ApiSolanaService.name)
  readonly connection = new Connection(this.core.config.solanaEndpoint, 'confirmed')

  constructor(private readonly core: ApiCoreService) {}

  @OnEvent(CORE_APP_STARTED)
  async onApplicationStarted() {
    this.logger.verbose(`Solana Fee Payer: ${this.core.config.solanaFeePayer.publicKey}`)

    await this.solanaRequestAirdrop(this.core.config.solanaFeePayer.publicKey.toString()).then((res) => {
      this.logger.verbose(`Fee Payer Balances: ${res.sol} SOL`)
    })
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async ensureFeePayerBalance() {
    const feePayer = this.core.config.solanaFeePayer.publicKey
    const minimal = this.core.config.solanaFeePayerMinimalBalance
    const balance = await this.connection.getBalance(feePayer)
    if (balance < LAMPORTS_PER_SOL * minimal) {
      this.logger.warn(`FEE PAYER WARNING: "${feePayer}"`)
      this.logger.warn(`Balance is low: ${balance / LAMPORTS_PER_SOL} SOL, recommended: ${minimal} SOL`)
    }
    return balance
  }

  async getAccount(publicKey: PublicKey | string): Promise<SolanaAccountInfo | null> {
    return this.connection
      .getParsedAccountInfo(new PublicKey(publicKey))
      .then((res) => (res.value ? (res.value as SolanaAccountInfo) : null))
  }
  async getMint(publicKey: PublicKey | string, programId: PublicKey = TOKEN_2022_PROGRAM_ID) {
    return getMint(this.connection, new PublicKey(publicKey), 'confirmed', programId)
  }

  async getAccountTokenMetadata(mint: PublicKey | string) {
    const account = await this.getAccount(mint)
    if (!account) {
      throw new Error('Mint account not found on Solana')
    }
    if (!account.data?.parsed?.info?.extensions) {
      throw new Error('Mint account has no extensions')
    }
    const extensions: { extension: string; state: TokenMetadata }[] = account.data.parsed.info.extensions
    const metadata = extensions.find((e) => e.extension === 'tokenMetadata')
    if (!metadata?.state) {
      throw new Error('Mint account has no tokenMetadata')
    }

    return metadata.state
  }

  async getBalance(account: string) {
    return this.connection.getBalance(new PublicKey(account))
  }

  async getTokenAccounts(account: string) {
    const [tokenAccounts, token2022Accounts] = await Promise.all([
      this.connection.getParsedTokenAccountsByOwner(new PublicKey(account), { programId: TOKEN_PROGRAM_ID }),
      this.connection.getParsedTokenAccountsByOwner(new PublicKey(account), { programId: TOKEN_2022_PROGRAM_ID }),
    ])
    return [...tokenAccounts.value, ...token2022Accounts.value]
  }

  async getTransactions(account: string) {
    return this.connection.getConfirmedSignaturesForAddress2(new PublicKey(account), { limit: 50 }, 'confirmed')
  }

  getAnchorProvider(keypair = Keypair.generate()) {
    return new AnchorProvider(this.connection, new AnchorKeypairWallet(keypair), AnchorProvider.defaultOptions())
  }

  async solanaRequestAirdrop(account: string) {
    const [sol] = await Promise.all([this.getBalance(account).then((res) => res / LAMPORTS_PER_SOL)])

    if (sol < 1) {
      await this.connection.requestAirdrop(new PublicKey(account), LAMPORTS_PER_SOL)
    }

    return { sol }
  }

  async getTokenBalance(account: string, mint: string, programId: string) {
    return this.connection
      .getParsedTokenAccountsByOwner(new PublicKey(account), {
        mint: new PublicKey(mint),
        programId: new PublicKey(programId),
      })
      .then((res) => {
        // Yeah, yeah. I know you can have multiple token accounts for the same mint. Hackathon code baby!
        return res.value?.length ? res.value[0].account.data.parsed.info.tokenAmount.uiAmount : 0
      })
  }

  getExplorerUrl(path: string) {
    const cluster = this.connection.rpcEndpoint.includes('devnet') ? `?cluster=devnet` : ''

    return `https://explorer.solana.com/${path}${cluster}`
  }

  async sendAndConfirmTransaction({
    transaction,
    blockhash,
    lastValidBlockHeight,
  }: {
    transaction: VersionedTransaction
    blockhash: string
    lastValidBlockHeight: number
  }): Promise<string> {
    const signature = await this.connection.sendTransaction(transaction, { skipPreflight: true })
    this.logger.debug(`Signature: ${this.getExplorerUrl(`tx/${signature}`)}`)
    await this.connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, 'confirmed')
    this.logger.debug(`Confirmed: ${signature}`)
    return signature
  }

  async solanaSignAndConfirmTransaction(tx: Uint8Array) {
    // TODO: Add validation to the incoming transaction

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash()

    const transaction = VersionedTransaction.deserialize(tx)

    transaction.sign([this.core.config.solanaFeePayer])

    console.log(`transaction`, transaction)
    console.log(`transaction`, transaction.signatures)

    return this.sendAndConfirmTransaction({
      transaction,
      blockhash,
      lastValidBlockHeight,
    })
  }
}
