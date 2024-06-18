import { AnchorProvider } from '@coral-xyz/anchor'
import { useAppConfig } from '@pubkey-network/web-core-data-access'
import { WalletModalProvider } from '@pubkeyapp/wallet-adapter-mantine-ui'
import { WalletError } from '@solana/wallet-adapter-base'
import {
  AnchorWallet,
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { ReactNode, useCallback } from 'react'

export function SolanaClusterProvider({ autoConnect, children }: { autoConnect?: boolean; children: ReactNode }) {
  return <SolanaProvider autoConnect={autoConnect}>{children}</SolanaProvider>
}

export function SolanaProvider({ autoConnect = true, children }: { autoConnect?: boolean; children: ReactNode }) {
  const { solanaEndpoint: endpoint } = useAppConfig()

  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={autoConnect}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useAnchorProvider() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}
