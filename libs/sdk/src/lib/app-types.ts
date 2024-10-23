import { IdentityProvider, PubKeyIdentity } from '@pubkey-protocol/sdk'
import { Identity, IdentityProvider as SdkIdentityProvider, PubkeyProfileIdentity } from '../generated/graphql-sdk'

export type AppIdentity = PubKeyIdentity | Identity | PubkeyProfileIdentity
export type AppIdentityProvider = IdentityProvider | SdkIdentityProvider
