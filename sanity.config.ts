import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'believe-in-reading',
  title: '相信閱讀 CMS',
  projectId: 'vrbw1z7k',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: '2025-04-25' }),
  ],
  schema: {
    types: schemaTypes,
  },
})
