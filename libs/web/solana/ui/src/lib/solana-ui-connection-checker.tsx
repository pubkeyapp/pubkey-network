import { Button, Group, Text } from '@mantine/core'
import { useAppConfig } from '@pubkey-network/web-core-data-access'
import { UiWarning } from '@pubkey-ui/core'
import { useConnection } from '@solana/wallet-adapter-react'
import { IconNetworkOff } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'

export function SolanaUiConnectionChecker({ children }: { children: ReactNode }) {
  const { solanaEndpoint } = useAppConfig()
  const { connection } = useConnection()

  const query = useQuery({
    queryKey: ['version', { solanaEndpoint, endpoint: connection.rpcEndpoint }],
    queryFn: () => connection.getVersion(),
    retry: 1,
  })
  if (query.isLoading) {
    return null
  }
  if (query.isError || !query.data) {
    return (
      <UiWarning
        styles={{
          root: { display: 'flex', justifyContent: 'center' },
          title: { justifyContent: 'center' },
        }}
        title="Error connecting to cluster"
        icon={<IconNetworkOff />}
        message={
          <Group justify="center">
            <Text>
              Error connecting to endpoint <strong>{solanaEndpoint}</strong>
            </Text>
            <Button variant="light" color="yellow" size="xs" onClick={() => query.refetch()}>
              Refresh
            </Button>
          </Group>
        }
      />
    )
  }
  return children
}
