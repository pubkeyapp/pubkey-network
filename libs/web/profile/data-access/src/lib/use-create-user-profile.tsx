import { useSdk } from '@pubkey-network/web-core-data-access'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMutation } from '@tanstack/react-query'

export function useCreateUserProfile() {
  const sdk = useSdk()
  const { publicKey } = useWallet()

  return useMutation({
    mutationFn: (tx: Uint8Array) =>
      sdk
        .createUserProfile({
          publicKey: publicKey?.toString() ?? '',
        })
        .then(async (res) => {
          console.log(`res`, res)
        }),
  })
}
