import { ButtonProps } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import { MouseClickHandler } from './interfaces'

export type WalletButtonProps = PropsWithChildren<
  ButtonProps & {
    children?: React.ReactNode
    label?: string
    onClick?: MouseClickHandler
  }
>
