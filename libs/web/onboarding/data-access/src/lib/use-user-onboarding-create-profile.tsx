import { sdk } from '@pubkey-network/web-core-data-access'
import { toastError } from '@pubkey-ui/core'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { VersionedTransaction } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'

export function useUserOnboardingCreateProfile() {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  return useMutation({
    mutationFn: async () => {
      if (!publicKey) {
        toastError(`Connect your wallet to continue`)
        throw new Error('No public key')
      }
      if (!signTransaction) {
        toastError(`Connect your wallet to continue (no Sign Transaction)`)
        throw new Error('No sign transaction')
      }
      return sdk.userOnboardingCreateProfile({ publicKey: publicKey.toBase58() }).then(async (res) => {
        if (!res.data.created) {
          toastError(`Error creating profile`)
          throw new Error('Error creating profile')
        }
        console.log(`res.data.created`, res.data.created)
        const unsigned = VersionedTransaction.deserialize(Uint8Array.from(res.data.created))

        const tx = await signTransaction(unsigned).catch((err) => toastError(err.message))

        if (!tx) {
          toastError(`Error creating profile (singing transaction)`)
          return
        }
        return sdk
          .solanaSignAndConfirmTransaction({
            tx: Array.from(tx.serialize()),
          })
          .then((res) => res.data.signature ?? '')
      })
    },
  })
}
