import { getKeypairFromByteArray } from '@pubkey-protocol/sdk'
import { Keypair } from '@solana/web3.js'

// Remove trailing slashes from the URLs to avoid double slashes
const API_URL = getUrl('API_URL') as string

if (!API_URL) {
  throw new Error('API_URL is not set. Make sure to set it in the .env file')
}
// Infer the WEB URL from the API_URL if it's not set
const WEB_URL = getUrl('WEB_URL') ?? API_URL?.replace('/api', '')

const cookieDomains: string[] = getCookieDomains()

// Infer the cookie domain from the API_URL if it's not set
if (!cookieDomains.length) {
  const { hostname } = new URL(API_URL)
  cookieDomains.push(hostname)
}

const corsOrigins: string[] = getCorsOrigins()

export type Env = 'development' | 'production' | 'test' | 'provision'
export interface ApiCoreConfig {
  apiUrl: string
  // Discord Authentication
  authDiscordAdminIds: string[]
  authDiscordClientId: string
  authDiscordClientSecret: string
  authDiscordEnabled: boolean
  // GitHub Authentication
  authGithubAdminIds: string[]
  authGithubClientId: string
  authGithubClientSecret: string
  authGithubEnabled: boolean
  // Google Authentication
  authGoogleAdminIds: string[]
  authGoogleClientId: string
  authGoogleClientSecret: string
  authGoogleEnabled: boolean
  // Telegram Authentication
  authTelegramAdminIds: string[]
  authTelegramBotToken: string
  authTelegramEnabled: boolean
  // X Authentication
  authXAdminIds: string[]
  authXConsumerKey: string
  authXConsumerSecret: string
  authXEnabled: boolean
  // Username and Password Authentication
  authPasswordEnabled: boolean
  authRegisterEnabled: boolean
  // Solana Authentication
  authSolanaAdminIds: string[]
  authSolanaEnabled: boolean
  // Cookies
  cookieDomains: string[]
  cookieName: string
  cookieSecure: boolean
  corsOrigins: string[]
  databaseProvision: boolean
  environment: Env
  host: string
  jwtSecret: string
  port: number
  sessionSecret: string
  pubkeyProtocolSigner: Keypair
  pubkeyProtocolSignerMinimalBalance: number
  solanaEndpoint: string
  solanaEndpointPublic: string
  webUrl: string
}

export function configuration(): ApiCoreConfig {
  return {
    apiUrl: process.env['API_URL'] as string,
    authDiscordAdminIds: getFromEnvironment('AUTH_DISCORD_ADMIN_IDS'),
    authDiscordClientId: process.env['AUTH_DISCORD_CLIENT_ID'] as string,
    authDiscordClientSecret: process.env['AUTH_DISCORD_CLIENT_SECRET'] as string,
    authDiscordEnabled: process.env['AUTH_DISCORD_ENABLED'] === 'true',
    authGithubAdminIds: getFromEnvironment('AUTH_GITHUB_ADMIN_IDS'),
    authGithubClientId: process.env['AUTH_GITHUB_CLIENT_ID'] as string,
    authGithubClientSecret: process.env['AUTH_GITHUB_CLIENT_SECRET'] as string,
    authGithubEnabled: process.env['AUTH_GITHUB_ENABLED'] === 'true',
    authGoogleAdminIds: getFromEnvironment('AUTH_GOOGLE_ADMIN_IDS'),
    authGoogleClientId: process.env['AUTH_GOOGLE_CLIENT_ID'] as string,
    authGoogleClientSecret: process.env['AUTH_GOOGLE_CLIENT_SECRET'] as string,
    authGoogleEnabled: process.env['AUTH_GOOGLE_ENABLED'] === 'true',
    authTelegramAdminIds: getFromEnvironment('AUTH_TELEGRAM_ADMIN_IDS'),
    authTelegramBotToken: process.env['AUTH_TELEGRAM_BOT_TOKEN'] as string,
    authTelegramEnabled: process.env['AUTH_TELEGRAM_ENABLED'] === 'true',
    authXAdminIds: getFromEnvironment('AUTH_X_ADMIN_IDS'),
    authXConsumerKey: process.env['AUTH_X_CONSUMER_KEY'] as string,
    authXConsumerSecret: process.env['AUTH_X_CONSUMER_SECRET'] as string,
    authXEnabled: process.env['AUTH_X_ENABLED'] === 'true',
    authPasswordEnabled: process.env['AUTH_PASSWORD_ENABLED'] === 'true',
    authRegisterEnabled: process.env['AUTH_REGISTER_ENABLED'] === 'true',
    authSolanaAdminIds: getFromEnvironment('AUTH_SOLANA_ADMIN_IDS'),
    authSolanaEnabled: process.env['AUTH_SOLANA_ENABLED'] === 'true',
    cookieDomains,
    cookieName: '__session',
    cookieSecure: process.env['COOKIE_SECURE'] === 'true',
    corsOrigins,
    databaseProvision: process.env['DATABASE_PROVISION'] === 'true',
    environment: (process.env['NODE_ENV'] as Env) || 'development',
    host: process.env['HOST'] as string,
    jwtSecret: process.env['JWT_SECRET'] as string,
    port: parseInt(process.env['PORT'] as string, 10) || 3000,
    pubkeyProtocolSigner: getKeypairFromByteArray(
      JSON.parse(process.env['PUBKEY_PROTOCOL_SIGNER_SECRET_KEY'] as string),
    ),
    pubkeyProtocolSignerMinimalBalance:
      parseFloat(process.env['PUBKEY_PROTOCOL_SIGNER_MINIMAL_BALANCE'] as string) || 1,
    solanaEndpoint: process.env['SOLANA_ENDPOINT'] as string,
    solanaEndpointPublic: process.env['SOLANA_ENDPOINT_PUBLIC'] as string,
    sessionSecret: process.env['SESSION_SECRET'] as string,
    webUrl: WEB_URL,
  }
}

// Get the cookie domains from the ENV
function getCookieDomains() {
  return getFromEnvironment('COOKIE_DOMAINS').filter(Boolean)
}

// Get the origins from the ENV
function getCorsOrigins() {
  return getFromEnvironment('CORS_ORIGINS').filter(Boolean)
}

// Get the values from the ENV
function getFromEnvironment(key: string) {
  return (process.env[key]?.includes(',') ? (process.env[key]?.split(',') as string[]) : [process.env[key]]) as string[]
}

function getUrl(key: string) {
  return process.env[key]?.replace(/\/$/, '')
}
