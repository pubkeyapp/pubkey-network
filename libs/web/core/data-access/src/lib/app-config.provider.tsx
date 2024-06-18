import { AppConfig, IdentityProvider } from '@pubkey-network/sdk'
import { toastError } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { createContext, ReactNode, useContext, useMemo } from 'react'

// This is provided by /api/__/env.js included in index.html
const appConfig: AppConfig = (window as unknown as { __env: AppConfig }).__env

if (!appConfig) {
  toastError('App config not found')
}

export interface AuthProviderContext {
  appConfig?: AppConfig | undefined
  authEnabled: boolean
  enabledProviders: IdentityProvider[]
  getExplorerUrl: (path: string) => string
  solanaEndpoint: string
  solanaFeePayer: PublicKey
}

const Context = createContext<AuthProviderContext>({} as AuthProviderContext)

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const authEnabled = useMemo(() => {
    if (!appConfig) return false
    const {
      authDiscordEnabled,
      authGithubEnabled,
      authGoogleEnabled,
      authPasswordEnabled,
      authRegisterEnabled,
      authSolanaEnabled,
      authTelegramEnabled,
      authTwitterEnabled,
    } = appConfig as AppConfig
    return (
      authDiscordEnabled ||
      authGithubEnabled ||
      authGoogleEnabled ||
      authRegisterEnabled ||
      authPasswordEnabled ||
      authSolanaEnabled ||
      authTelegramEnabled ||
      authTwitterEnabled
    )
  }, [appConfig])

  const enabledProviders: IdentityProvider[] = useMemo(
    () =>
      appConfig
        ? ([
            appConfig.authDiscordEnabled && IdentityProvider.Discord,
            appConfig.authGithubEnabled && IdentityProvider.GitHub,
            appConfig.authGoogleEnabled && IdentityProvider.Google,
            appConfig.authSolanaEnabled && IdentityProvider.Solana,
            appConfig.authTelegramEnabled && IdentityProvider.Telegram,
            appConfig.authTwitterEnabled && IdentityProvider.Twitter,
          ].filter(Boolean) as IdentityProvider[])
        : [],
    [appConfig],
  )

  const value: AuthProviderContext = {
    appConfig,
    authEnabled,
    enabledProviders,
    getExplorerUrl: (path: string) =>
      `https://explorer.solana.com/${path}${getClusterUrlParam(appConfig.solanaEndpoint)}`,
    solanaEndpoint: appConfig.solanaEndpoint,
    solanaFeePayer: new PublicKey(appConfig.solanaFeePayer),
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useAppConfig() {
  return useContext(Context)
}

function getClusterUrlParam(endpoint: string): string {
  let suffix = ''
  if (endpoint.includes('devnet')) {
    suffix = 'devnet'
  } else if (endpoint.includes('testnet')) {
    suffix = 'testnet'
  } else if (endpoint.includes('localhost')) {
    suffix = `custom&customUrl=${encodeURIComponent(endpoint)}`
  } else {
    suffix = ''
  }

  return suffix.length ? `?cluster=${suffix}` : ''
}
