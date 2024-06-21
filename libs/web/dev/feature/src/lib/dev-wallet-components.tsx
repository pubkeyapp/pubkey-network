import { Button, ButtonProps, Divider, Group, SimpleGrid } from '@mantine/core'
import {
  WalletConnectButton,
  WalletDisconnectButton,
  WalletModalButton,
  WalletMultiButton,
  WalletMultiIcon,
} from '@pubkey-network/wallet-adapter-mantine-ui'
import { UiCard, UiDebug, UiGroup, UiStack } from '@pubkey-ui/core'
import { useEffect, useState } from 'react'

export function DevWalletComponents() {
  return (
    <UiStack>
      <Divider label="Buttons" />
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <UiCard title="WalletMultiButton">
          <WalletMultiButton size="lg" />
        </UiCard>
        <UiCard title="WalletDisconnectButton">
          <WalletDisconnectButton size="lg" />
        </UiCard>
        <UiCard title="WalletModalButton">
          <WalletModalButton size="lg" />
        </UiCard>
        <UiCard title="WalletConnectButton">
          <WalletConnectButton size="lg" />
        </UiCard>
        <UiCard title="WalletMultiIcon">
          <WalletMultiIcon size="lg" />
        </UiCard>
      </SimpleGrid>
      <Divider label="Random" />
      <DemoRandom />
      <Divider label="Button variants" />
      <DemoVariants />
      <Divider label="Button sizes" />
      <DemoSizes />
      <Divider label="Button radius" />
      <DemoRadius />
      <Divider label="Button colors" />
      <ButtonColors />
    </UiStack>
  )
}

const sizes: ButtonProps['size'][] = ['xl', 'lg', 'md', 'sm', 'xs']
const radii: ButtonProps['radius'][] = ['xs', 'sm', 'md', 'lg', 'xl']
const variants: ButtonProps['variant'][] = ['default', 'filled', 'light', 'outline', 'subtle', 'transparent', 'white']
const colors: ButtonProps['color'][] = [
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
  'gray',
]

function DemoRandom() {
  const [size, setSize] = useState<ButtonProps['size']>('md')
  const [radius, setRadius] = useState<ButtonProps['radius']>('md')
  const [variant, setVariant] = useState<ButtonProps['variant']>('default')
  const [color, setColor] = useState<ButtonProps['color']>('blue')

  function randomize() {
    setSize(sizes[Math.floor(Math.random() * sizes.length)])
    setRadius(radii[Math.floor(Math.random() * radii.length)])
    setVariant(variants[Math.floor(Math.random() * variants.length)])
    setColor(colors[Math.floor(Math.random() * colors.length)])
  }
  useEffect(() => {
    randomize()
  }, [])

  return (
    <UiGroup align="start" justify="space-around">
      <Button onClick={randomize}>Randomize</Button>
      <Group justify="center">
        <WalletMultiButton size={size} radius={radius} variant={variant} color={color} />
        <WalletMultiIcon size={size} radius={radius} variant={variant} color={color} />
      </Group>
      <UiDebug data={{ size, radius, variant, color }} open hideButton />
    </UiGroup>
  )
}

function DemoSizes() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
      {sizes.map((size) => (
        <UiCard key={size} title={`size="${size}"`}>
          <Group>
            <WalletMultiButton size={size} />
            <WalletMultiIcon size={size} />
          </Group>
        </UiCard>
      ))}
    </SimpleGrid>
  )
}

function DemoRadius() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
      {radii.map((radius) => (
        <UiCard key={radius} title={`radius="${radius}"`}>
          <Group>
            <WalletMultiButton radius={radius} />
            <WalletMultiIcon radius={radius} />
          </Group>
        </UiCard>
      ))}
    </SimpleGrid>
  )
}

function DemoVariants() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
      {variants.map((variant) => (
        <UiCard key={variant} title={`variant="${variant}"`}>
          <Group>
            <WalletMultiButton variant={variant} />
            <WalletMultiIcon variant={variant} />
          </Group>
        </UiCard>
      ))}
    </SimpleGrid>
  )
}

function ButtonColors() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
      {colors.map((color) => (
        <UiCard key={color} title={`color="${color}"`}>
          <Group>
            <WalletMultiButton color={color} />
            <WalletMultiIcon color={color} />
          </Group>
        </UiCard>
      ))}
    </SimpleGrid>
  )
}
