import type { ReactNode } from 'react'
import { CircleHelp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { panel } from '../../../styles/controlStyles'

export default function EmptyState({
  title,
  description,
  children,
  icon: Icon = CircleHelp,
}: {
  title: string
  description?: string
  children?: ReactNode
  icon?: LucideIcon
}) {
  return (
    <div className={`${panel} grid justify-items-center gap-3 px-5 py-12 text-center`}>
      <Icon size={28} className="text-accent" aria-hidden="true" />
      <p className="font-bold">{title}</p>
      {description && <p className="max-w-sm text-sm leading-relaxed text-muted">{description}</p>}
      {children}
    </div>
  )
}
