import { PubKeyIdentity, PubKeyIdentityProvider } from '@pubkey-program-library/anchor'
import { Identity, IdentityProvider } from '../generated/graphql-sdk'

export type AppIdentity = PubKeyIdentity | Identity
export type AppIdentityProvider = PubKeyIdentityProvider | IdentityProvider
