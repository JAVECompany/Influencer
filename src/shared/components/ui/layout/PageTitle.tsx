import type { ReactNode } from 'react'

export default function PageTitle({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-[34px]">{title}</h1>
        {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>}
      </div>
      {children}
    </header>
  )
}
