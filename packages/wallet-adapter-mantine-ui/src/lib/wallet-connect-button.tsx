import { Button } from '@mantine/core'
import { useWallet } from '@solana/wallet-adapter-react'
import type { MouseEventHandler } from 'react'
import React, { useCallback, useMemo } from 'react'
import type { WalletButtonProps } from './wallet-button-props'
import { WalletIcon } from './wallet-icon'

export function WalletConnectButton({ children, disabled, onClick, ...props }: WalletButtonProps) {
  const { wallet, connect, connecting, connected } = useWallet()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (onClick) onClick(event)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!event.defaultPrevented) connect().catch(() => {})
    },
    [onClick, connect],
  )

  const content = useMemo(() => {
    if (children) return children
    if (connecting) return 'Connecting'
    if (connected) return 'Connected'
    if (wallet) return 'Connect'
    return 'Connect Wallet'
  }, [children, connecting, connected, wallet])

  return (
    <Button
      disabled={disabled || !wallet || connecting || connected}
      leftSection={wallet ? <WalletIcon wallet={wallet} size={props.size} /> : undefined}
      onClick={handleClick}
      px="sm"
      {...props}
    >
      {content}
    </Button>
  )
}
