import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemaTypes'
import { deskStructure } from './src/sanity/deskStructure'
import { articleTemplateDefinitions } from './src/sanity/articleTemplates'
import { socialPostTemplateDefinitions } from './src/sanity/socialPostTemplates'

export default defineConfig({
  name: 'believe-in-reading',
  title: '相信閱讀 CMS',
  projectId: 'vrbw1z7k',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: '2025-04-25' }),
  ],
  schema: {
    types: schemaTypes,
    templates: [...articleTemplateDefinitions, ...socialPostTemplateDefinitions],
  },
})
