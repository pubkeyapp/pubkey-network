import { Button } from '@mantine/core'
import { IconCurrencySolana } from '@tabler/icons-react'
import type { MouseEvent } from 'react'
import React, { useCallback } from 'react'
import { useWalletModal } from './use-wallet-modal'
import type { WalletButtonProps } from './wallet-button-props'
import { convertSize } from './wallet-icon'

export function WalletModalButton({ children, label, onClick, ...props }: WalletButtonProps) {
  const { visible, setVisible } = useWalletModal()
  const iconSize = convertSize(props.size)
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(event)
      if (!event.defaultPrevented) setVisible(!visible)
    },
    [onClick, setVisible, visible],
  )

  return (
    <Button
      onClick={handleClick}
      leftSection={<IconCurrencySolana height={iconSize} width={iconSize} />}
      px="sm"
      {...props}
    >
      {children ?? label ?? 'Select Wallet'}
    </Button>
  )
}
