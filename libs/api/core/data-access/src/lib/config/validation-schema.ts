import { clusterApiUrl } from '@solana/web3.js'
import * as Joi from 'joi'

export const validationSchema = Joi.object({
  API_URL: Joi.string().required().error(new Error(`API_URL is required.`)),
  // Discord Authentication
  AUTH_DISCORD_ADMIN_IDS: Joi.string(),
  AUTH_DISCORD_CLIENT_ID: Joi.string(),
  AUTH_DISCORD_CLIENT_SECRET: Joi.string(),
  AUTH_DISCORD_ENABLED: Joi.boolean().default(true),
  // GitHub Authentication
  AUTH_GITHUB_ADMIN_IDS: Joi.string(),
  AUTH_GITHUB_CLIENT_ID: Joi.string(),
  AUTH_GITHUB_CLIENT_SECRET: Joi.string(),
  AUTH_GITHUB_ENABLED: Joi.boolean().default(true),
  // Google Authentication
  AUTH_GOOGLE_ADMIN_IDS: Joi.string(),
  AUTH_GOOGLE_CLIENT_ID: Joi.string(),
  AUTH_GOOGLE_CLIENT_SECRET: Joi.string(),
  AUTH_GOOGLE_ENABLED: Joi.boolean().default(true),
  // Telegram Authentication
  AUTH_TELEGRAM_ADMIN_IDS: Joi.string(),
  AUTH_TELEGRAM_BOT_TOKEN: Joi.string(),
  AUTH_TELEGRAM_ENABLED: Joi.boolean().default(true),
  // X Authentication
  AUTH_X_ADMIN_IDS: Joi.string(),
  AUTH_X_CONSUMER_KEY: Joi.string(),
  AUTH_X_CONSUMER_SECRET: Joi.string(),
  AUTH_X_ENABLED: Joi.boolean().default(true),
  // Username and Password Authentication
  AUTH_PASSWORD_ENABLED: Joi.boolean().default(true),
  AUTH_REGISTER_ENABLED: Joi.boolean().default(true),
  // Solana Authentication
  AUTH_SOLANA_ADMIN_IDS: Joi.string(),
  AUTH_SOLANA_ENABLED: Joi.boolean().default(true),
  // Cloak
  CLOAK_MASTER_KEY: Joi.string().required().error(new Error(`CLOAK_MASTER_KEY is required.`)),
  CLOAK_KEYCHAIN: Joi.string().required().error(new Error(`CLOAK_KEYCHAIN is required.`)),
  // Cookie
  COOKIE_NAME: Joi.string().default('__session'),
  COOKIE_SECURE: Joi.boolean().default(true),
  // Database
  DATABASE_PROVISION: Joi.boolean().default(false),
  DATABASE_URL: Joi.string(),
  GRAPHQL_PLAYGROUND: Joi.boolean().default(false),
  JWT_SECRET: Joi.string().required(),
  HOST: Joi.string().default('0.0.0.0'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(3000),
  PUBKEY_PROTOCOL_SIGNER_SECRET_KEY: Joi.string().required(),
  PUBKEY_PROTOCOL_SIGNER_MINIMAL_BALANCE: Joi.number().default(1),
  SESSION_SECRET: Joi.string().required(),
  SOLANA_ENDPOINT: Joi.string().required().default(clusterApiUrl('devnet')),
  SOLANA_ENDPOINT_PUBLIC: Joi.string().required().default(clusterApiUrl('devnet')),
  SYNC_DRY_RUN: Joi.boolean().default(false),
})
