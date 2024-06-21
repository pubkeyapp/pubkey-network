import { PubKeyIdentity, PubKeyIdentityProvider } from '@pubkey-program-library/anchor'
import { Identity, IdentityProvider, PubkeyProfileIdentity } from '../generated/graphql-sdk'

export type AppIdentity = PubKeyIdentity | Identity | PubkeyProfileIdentity
export type AppIdentityProvider = PubKeyIdentityProvider | IdentityProvider
