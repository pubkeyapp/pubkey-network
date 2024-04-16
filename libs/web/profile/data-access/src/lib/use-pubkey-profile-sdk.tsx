import { useAnchorProvider, useCluster } from '@pubkey-network/web-solana-data-access'
import { getPubkeyProfileProgramId } from '@pubkey-program-library/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster } from '@solana/web3.js'
import { useMemo } from 'react'
import { WebPubKeyProfileSdk } from './web-pubkey-profile-sdk'

export function usePubkeyProfileSdk() {
  const { connection } = useConnection()
  const { cluster, getExplorerUrl } = useCluster()
  const provider = useAnchorProvider()

  const sdk = useMemo(() => {
    const programId = getPubkeyProfileProgramId(cluster.network as Cluster)

    return new WebPubKeyProfileSdk({ connection, programId, provider })
  }, [connection, cluster, provider])

  return {
    connection,
    cluster,
    getExplorerUrl,
    sdk,
  }
}
