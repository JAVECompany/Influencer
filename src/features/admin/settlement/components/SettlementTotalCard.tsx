import type { LucideIcon } from 'lucide-react'
import { panel } from '../../../../shared/styles/controlStyles'

export default function SettlementTotalCard({
  label,
  value,
  detail,
  icon: Icon,
  emphasis,
}: {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  emphasis?: boolean
}) {
  return (
    <div className={`${panel} min-w-0 p-4 ${emphasis ? 'border-accent/35 bg-accent-soft' : ''}`}>
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-muted">
        {label}
        <Icon className="shrink-0 text-accent" size={17} />
      </div>
      <p className={`mt-3 text-2xl font-black break-words tabular-nums ${emphasis ? 'text-accent' : ''}`}>
        {value}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
    </div>
  )
}
