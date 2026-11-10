import { CalendarDays, Coins, Wallet } from 'lucide-react'
import { formatKrw } from '../../../../shared/utils/format/format'
import type { SettlementReportType } from '../types/settlementReport'
import SettlementTotalCard from './SettlementTotalCard'

export default function SettlementSummary({
  month,
  total,
}: {
  month: string
  total: SettlementReportType['total']
}) {
  return (
    <section className="mb-7" aria-labelledby="month-settlement">
      <h2 id="month-settlement" className="mb-3 flex items-center gap-2 font-black">
        <CalendarDays className="text-accent" size={17} />
        이번 달 지급 예정 <span className="text-xs font-medium text-muted">{month} · KST</span>
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <SettlementTotalCard
          label="크리에이터 지급 총계"
          value={formatKrw(total.due)}
          detail="구독권 매출 + 코인 지급액"
          icon={Wallet}
          emphasis
        />
        <SettlementTotalCard
          label="구독권 매출"
          value={formatKrw(total.subs)}
          detail="이번 달 고객 구독 결제 합계"
          icon={CalendarDays}
        />
        <SettlementTotalCard
          label="코인 정산"
          value={formatKrw(total.net)}
          detail={'플랫폼 코인 수수료 ' + formatKrw(total.fee)}
          icon={Coins}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        지급 예상액에는 구독권 매출 전액과 코인 수수료 공제 후 금액을 반영합니다.
      </p>
    </section>
  )
}
