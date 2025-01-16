import { useAppConfig } from '@pubkey-network/web-core-data-access'
import { useAnchorProvider } from '@pubkey-network/web-solana-data-access'
import { PUBKEY_PROTOCOL_PROGRAM_ID, PubKeyProtocolSdk } from '@pubkey-protocol/sdk'
import { useConnection } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

export function usePubKeyProtocolSdk() {
  const { connection } = useConnection()
  const { solanaEndpoint, getExplorerUrl } = useAppConfig()
  const provider = useAnchorProvider()

  const sdk = useMemo(() => {
    const programId = PUBKEY_PROTOCOL_PROGRAM_ID

    return new PubKeyProtocolSdk({ connection, programId, provider })
  }, [connection, provider])

  return {
    connection,
    solanaEndpoint,
    getExplorerUrl,
    sdk,
  }
}
