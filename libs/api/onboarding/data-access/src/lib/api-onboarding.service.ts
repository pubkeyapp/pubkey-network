import { Injectable } from '@nestjs/common'
import { IdentityProvider } from '@prisma/client'
import { ApiCoreService, ellipsify } from '@pubkey-network/api-core-data-access'

@Injectable()
export class ApiOnboardingService {
  constructor(private readonly core: ApiCoreService) {}

  async getOnboardingUsernames(userId: string) {
    const found = await this.core.data.user.findUnique({
      where: { id: userId },
      include: { identities: true },
    })
    if (!found) {
      throw new Error(`User ${userId} not found`)
    }
    const usernames = found.identities
      .filter((i) => i?.profile)
      .map((i) => i.profile as { username?: string })
      // Remove any identities that don't have a username
      .filter((i) => i.username)
      // Take the username property
      .map((i) => i.username as string)
      // Take the first part of any email addresses
      .map((i) => i?.split('@')[0])
      // Convert any special characters to lowercase
      .map((i) => i.replace(/[^a-z0-9]/gi, '_').toLowerCase())

    // For all usernames with an underscore, also offer the username without the underscore
    for (const username of usernames) {
      if (username.includes('_')) {
        usernames.push(username.replace('_', ''))
      }
    }

    const wallets = found.identities
      // Remove any identities that are not Solana wallets
      .filter((i) => i?.provider === IdentityProvider.Solana)
      // Take the providerId property
      .map((i) => i.providerId as string)
      // Convert any special characters to lowercase
      .map((i) => ellipsify(i, 4, '__').toLowerCase())

    usernames.push(...wallets)

    // Remove any duplicates and sort the usernames
    return Array.from(new Set(usernames)).sort()
  }

  async getOnboardingAvatarUrls(userId: string) {
    const found = await this.core.data.user.findUnique({
      where: { id: userId },
      include: { identities: true },
    })
    if (!found) {
      throw new Error(`User ${userId} not found`)
    }

    const usernames: string[] = []

    const avatarUrls = found.identities
      .filter((i) => i?.profile)
      .map((i) => i.profile as { avatarUrl?: string; username?: string })
      .map((i) => {
        // Collect any usernames
        if (i.username) {
          usernames.push(i.username)
        }
        return i
      })
      // Remove any identities that don't have a avatarUrl
      .filter((i) => i.avatarUrl)
      // Take the avatarUrl property
      .map((i) => i.avatarUrl as string)

    const cleaned = cleanupUsernames(usernames)

    for (const username of cleaned) {
      avatarUrls.push(`https://api.dicebear.com/9.x/initials/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${username}`)
    }

    // Remove any duplicates and sort the avatarUrls
    return Array.from(new Set(avatarUrls))
  }
}

function cleanupUsernames(usernames: string[]) {
  return (
    usernames // Take the first part of any email addresses
      .map((i) => i?.split('@')[0])
      // Convert any special characters to lowercase
      .map((i) => i.replace(/[^a-z0-9]/gi, '_').toLowerCase())
  )
}
