import { PortableText, type PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-6 leading-8 text-zinc-300">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 text-2xl font-bold text-white leading-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 text-xl font-semibold text-white leading-tight">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-emerald-500/70 pl-5 italic text-zinc-200">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 ml-6 list-disc space-y-2 text-zinc-300">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-zinc-300">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-8">{children}</li>,
    number: ({ children }) => <li className="leading-8">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      return (
        <a href={href} className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300">
          {children}
        </a>
      )
    },
  },
}

export default function SanityPortableText({
  value,
}: {
  value?: Parameters<typeof PortableText>[0]['value']
}) {
  if (!value) return null

  return <PortableText value={value} components={components} />
}
