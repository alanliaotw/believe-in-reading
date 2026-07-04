import { readFile, readdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sharedBrandDir = process.env.BELIEVE_SHARED_BRAND_DIR || join(homedir(), 'ai-shared', 'brand')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vrbw1z7k'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-04-25'
const candidate = readArgument('--check')

const CONTENT_CONCEPTS = [
  ['碳中和', 'carbonneutral'],
  ['淨零', 'netzero'],
  ['碳費'],
  ['碳稅'],
  ['碳權'],
  ['tnfd', '自然風險'],
  ['tcfd', '氣候財務揭露'],
  ['永續報告書', 'esg報告書'],
  ['供應鏈減碳', '供應鏈碳管理'],
  ['再生能源', '綠電'],
  ['esg人才', '永續人才'],
  ['循環經濟'],
  ['scope1', '範疇一'],
  ['scope2', '範疇二'],
  ['scope3', '範疇三'],
  ['永續禮盒'],
  ['數位導讀'],
]

function readArgument(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function readOptional(path) {
  try {
    return await readFile(path, 'utf8')
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') return ''
    throw error
  }
}

async function fetchSanityLedger() {
  const query = `*[_type in ["socialPost", "article"]] | order(coalesce(scheduledAt, publishedAt, _createdAt) desc) {
    _id,
    _type,
    title,
    topic,
    series,
    contentAngle,
    owner,
    status,
    platforms,
    scheduledAt,
    publishedAt,
    _createdAt
  }`
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', query)

  const response = await fetch(url, { headers: { accept: 'application/json' } })
  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  return Array.isArray(json.result) ? json.result : []
}

async function readLocalDrafts() {
  const draftDir = join(root, 'drafts')
  let files = []

  try {
    files = (await readdir(draftDir)).filter((file) => file.endsWith('.md')).sort()
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') return []
    throw error
  }

  const entries = []
  for (const file of files) {
    const path = join(draftDir, file)
    const markdown = await readFile(path, 'utf8')
    for (const match of markdown.matchAll(/^內部標題：(.+)$/gm)) {
      entries.push({ source: `草稿 ${relative(root, path)}`, title: match[1].trim() })
    }
  }
  return entries
}

function parseFacebookQueue(markdown) {
  return markdown
    .split(/^## 第 \d+ 則.*$/gm)
    .slice(1)
    .map((section) => section.match(/```\n\s*([^\n]+)/)?.[1]?.trim())
    .filter(Boolean)
    .map((title) => ({ source: 'FB 舊佇列', title }))
}

function parseMarketingLog(markdown) {
  return [...markdown.matchAll(/^- 【([^】]+)】｜([^｜]+)｜(.+?)｜(.+)$/gm)].map((match) => ({
    source: `戰情 ${match[1]} ${match[2].trim()}`,
    title: match[3].trim(),
    detail: match[4].trim(),
  }))
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\s\p{P}\p{S}]+/gu, '')
}

function bigrams(value) {
  const normalized = normalize(value)
  if (normalized.length < 2) return normalized ? [normalized] : []
  return Array.from({ length: normalized.length - 1 }, (_, index) => normalized.slice(index, index + 2))
}

function similarity(left, right) {
  const leftPairs = bigrams(left)
  const rightPairs = bigrams(right)
  if (!leftPairs.length || !rightPairs.length) return 0

  const remaining = new Map()
  for (const pair of rightPairs) remaining.set(pair, (remaining.get(pair) || 0) + 1)

  let overlap = 0
  for (const pair of leftPairs) {
    const count = remaining.get(pair) || 0
    if (!count) continue
    overlap += 1
    remaining.set(pair, count - 1)
  }

  const characterScore = (2 * overlap) / (leftPairs.length + rightPairs.length)
  return Math.max(characterScore, conceptSimilarity(left, right))
}

function conceptSimilarity(left, right) {
  const leftConcepts = findConcepts(left)
  const rightConcepts = findConcepts(right)
  if (!leftConcepts.size || !rightConcepts.size) return 0

  const overlap = [...leftConcepts].filter((concept) => rightConcepts.has(concept)).length
  if (!overlap) return 0

  const coverage = overlap / Math.max(leftConcepts.size, rightConcepts.size)
  return 0.65 + coverage * 0.35
}

function findConcepts(value) {
  const normalized = normalize(value)
  return new Set(
    CONTENT_CONCEPTS.filter((terms) => terms.some((term) => normalized.includes(normalize(term)))).map(
      ([canonical]) => canonical
    )
  )
}

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

function printSection(title, entries, limit = entries.length) {
  console.log(`\n## ${title}（${entries.length}）`)
  if (!entries.length) {
    console.log('- 無')
    return
  }

  for (const entry of entries.slice(0, limit)) {
    console.log(`- ${entry.title}${entry.meta ? `｜${entry.meta}` : ''}`)
  }
  if (entries.length > limit) console.log(`- ...另有 ${entries.length - limit} 筆，使用 --all 查看完整清單`)
}

const [sanityRecords, facebookQueueMarkdown, marketingLogMarkdown, localDrafts] = await Promise.all([
  fetchSanityLedger(),
  readOptional(join(sharedBrandDir, 'fb-repost-queue.md')),
  readOptional(join(sharedBrandDir, 'marketing-log.md')),
  readLocalDrafts(),
])

const socialPosts = sanityRecords
  .filter((record) => record._type === 'socialPost')
  .map((record) => ({
    source: 'Sanity socialPost',
    title: record.topic || record.title,
    detail: [record.title, record.contentAngle].filter(Boolean).join('｜'),
    meta: [record.status, record.owner, formatDate(record.scheduledAt || record.publishedAt)].filter(Boolean).join('｜'),
  }))

const articles = sanityRecords
  .filter((record) => record._type === 'article')
  .map((record) => ({
    source: 'Sanity article',
    title: record.title,
    meta: [record.status, formatDate(record.publishedAt || record._createdAt)].filter(Boolean).join('｜'),
  }))

const facebookQueue = parseFacebookQueue(facebookQueueMarkdown)
const marketingLog = parseMarketingLog(marketingLogMarkdown)
const showAll = process.argv.includes('--all')

console.log(`# 相信閱讀內容台帳｜${formatDate(new Date().toISOString())}`)
console.log('來源：Sanity socialPost + Sanity article + FB 舊佇列 + 戰情記錄 + 本機草稿')
console.log('注意：公開讀取看不到 Sanity drafts.* 私有草稿；佔題文件需先按 Publish，欄位維持 status=draft。')

printSection('Sanity 社群貼文', socialPosts)
printSection('Sanity 網站文章', articles, showAll ? articles.length : 25)
printSection('FB 舊排程／重發佇列', facebookQueue)
printSection('本機待審社群草稿', localDrafts)
printSection('近期戰情記錄', showAll ? marketingLog : marketingLog.slice(-30).reverse())

if (candidate) {
  const allEntries = [...socialPosts, ...articles, ...facebookQueue, ...localDrafts, ...marketingLog]
  const matches = allEntries
    .map((entry) => ({
      ...entry,
      score: Math.max(similarity(candidate, entry.title), similarity(candidate, entry.detail || '')),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 12)

  console.log(`\n## 候選主題查重：「${candidate}」`)
  if (!matches.length) {
    console.log('- 未找到近似內容；仍需人工確認切角。')
  } else {
    for (const match of matches) {
      const risk = match.score >= 0.55 ? '高風險' : match.score >= 0.35 ? '需確認' : '低相似'
      console.log(`- ${Math.round(match.score * 100)}% ${risk}｜${match.source}｜${match.title}`)
    }
  }
}
