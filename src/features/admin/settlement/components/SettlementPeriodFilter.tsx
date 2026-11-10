import { CalendarDays } from 'lucide-react'
import Button from '../../../../shared/components/ui/Button'
import FieldLabel from '../../../../shared/components/ui/FieldLabel'
import { field, panel } from '../../../../shared/styles/controlStyles'
import { periodOptions, settlementPeriod } from '../utils/settlement'
import type { PeriodMode } from '../utils/settlement'

export default function SettlementPeriodFilter({
  mode,
  start,
  end,
  today,
  period,
  onModeChange,
  onStartChange,
  onEndChange,
}: {
  mode: PeriodMode
  start: string
  end: string
  today: string
  period: ReturnType<typeof settlementPeriod>
  onModeChange: (mode: PeriodMode) => void
  onStartChange: (start: string) => void
  onEndChange: (end: string) => void
}) {
  return (
    <section className={`${panel} mb-5 p-4 sm:p-5`}>
      <h2 className="mb-3 flex items-center gap-2 font-black">
        <CalendarDays size={17} className="text-mint" /> 거래 조회 기간
      </h2>
      <div className="flex flex-wrap gap-2">
        {periodOptions.map(([key, label]) => (
          <Button
            key={key}
            aria-pressed={key === mode}
            tone={key === mode ? 'primary' : 'subtle'}
            onClick={() => onModeChange(key)}
          >
            {label}
          </Button>
        ))}
      </div>
      {mode === 'custom' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <FieldLabel title="시작일">
            <input
              type="date"
              className={field}
              value={start}
              max={end || today}
              onChange={(event) => onStartChange(event.target.value)}
            />
          </FieldLabel>
          <FieldLabel title="종료일">
            <input
              type="date"
              className={field}
              value={end}
              min={start || undefined}
              max={today}
              onChange={(event) => onEndChange(event.target.value)}
            />
          </FieldLabel>
        </div>
      )}
      <p className="mt-3 text-xs leading-relaxed text-dim">
        {period
          ? period.start + ' ~ ' + period.end + ' · 한국시간, 양 끝 날짜 포함'
          : '시작일과 종료일을 확인해 주세요.'}
      </p>
    </section>
  )
}
