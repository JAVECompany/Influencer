import type { ReactNode } from 'react'

export default function PageTitle({
  label,
  title,
  subtitle,
  children,
}: {
  label?: string
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {label && (
          <p className="mb-2.5 text-[11px] font-bold tracking-[.18em] text-mint uppercase">{label}</p>
        )}
        <h1 className="text-3xl leading-tight font-black tracking-tight sm:text-[34px]">{title}</h1>
        {subtitle && <p className="mt-2 text-sm leading-relaxed text-dim">{subtitle}</p>}
      </div>
      {children}
    </header>
  )
}
