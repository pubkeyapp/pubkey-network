import { IdentityProvider } from '@pubkey-network/sdk'
import { useSdk } from '@pubkey-network/web-core-data-access'
import { toastError } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { VersionedTransaction } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'

export function useProfileIdentityRemove() {
  const sdk = useSdk()
  const { publicKey, signTransaction } = useWallet()

  return useMutation({
    mutationFn: (input: { provider: IdentityProvider; providerId: string }) =>
      sdk.profileIdentityRemove({ ...input, publicKey: `${publicKey}` }).then(async (res) => {
        const unsigned = VersionedTransaction.deserialize(Uint8Array.from(res.data.tx))
        const tx = await signTransaction!(unsigned).catch((err) => toastError(err.message))
        if (!tx) {
          return
        }
        return sdk.solanaSignAndConfirmTransaction({ tx: Array.from(tx.serialize()) })
      }),
  })
}
