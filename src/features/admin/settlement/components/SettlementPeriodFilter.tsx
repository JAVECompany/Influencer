import { CalendarDays } from 'lucide-react'
import Button from '../../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../../shared/components/ui/forms/FieldLabel'
import { field, panel } from '../../../../shared/styles/controlStyles'
import { periodOptions, getSettlementPeriod } from '../utils/settlement'
import type { PeriodModeType } from '../utils/settlement'

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
  mode: PeriodModeType
  start: string
  end: string
  today: string
  period: ReturnType<typeof getSettlementPeriod>
  onModeChange: (mode: PeriodModeType) => void
  onStartChange: (start: string) => void
  onEndChange: (end: string) => void
}) {
  return (
    <section className={`${panel} mb-5 p-4 sm:p-5`}>
      <h2 className="mb-3 flex items-center gap-2 font-black">
        <CalendarDays size={17} className="text-accent" /> 거래 조회 기간
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
      <p className="mt-3 text-xs leading-relaxed text-muted">
        {period
          ? period.start + ' ~ ' + period.end + ' · 한국시간, 양 끝 날짜 포함'
          : '시작일과 종료일을 확인해 주세요.'}
      </p>
    </section>
  )
}
