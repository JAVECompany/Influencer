import type { LucideIcon } from 'lucide-react'
import { panel } from '../../styles/controlStyles'

export default function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className={`${panel} min-w-0 p-4 sm:p-5`}>
      <div className="flex items-center justify-between gap-2 text-sm text-dim">
        {label}
        <Icon size={17} className="shrink-0 text-mint" />
      </div>
      <p className="mt-3 text-xl font-black break-words tabular-nums sm:text-2xl">{value}</p>
    </div>
  )
}
