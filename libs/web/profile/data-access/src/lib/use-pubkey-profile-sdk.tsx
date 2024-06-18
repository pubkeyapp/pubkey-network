import { useAppConfig } from '@pubkey-network/web-core-data-access'
import { useAnchorProvider } from '@pubkey-network/web-solana-data-access'
import { PUBKEY_PROFILE_PROGRAM_ID } from '@pubkey-program-library/anchor'
import { PubKeyProfileSdk } from '@pubkey-program-library/sdk'
import { useConnection } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

export function usePubkeyProfileSdk() {
  const { connection } = useConnection()
  const { solanaEndpoint, getExplorerUrl } = useAppConfig()
  const provider = useAnchorProvider()

  const sdk = useMemo(() => {
    const programId = PUBKEY_PROFILE_PROGRAM_ID

    return new PubKeyProfileSdk({ connection, programId, provider })
  }, [connection, provider])

  return {
    connection,
    solanaEndpoint,
    getExplorerUrl,
    sdk,
  }
}
