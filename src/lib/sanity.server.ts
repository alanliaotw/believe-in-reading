import 'server-only'

import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '@/sanity/env'

let cachedClient: ReturnType<typeof createClient> | null = null

export function getSanityWriteClient() {
  if (cachedClient) return cachedClient

  const token = process.env.SANITY_API_TOKEN

  if (!token) {
    throw new Error('Missing env var: SANITY_API_TOKEN')
  }

  cachedClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })

  return cachedClient
}
