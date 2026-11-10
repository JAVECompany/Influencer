import { panel } from '../../../../shared/styles/controlStyles'
import { formatKrw } from '../../../../shared/utils/format/format'
import type { SettlementReport } from '../types/settlementReport'

export default function SettlementMonthlyRevenue({ monthly }: { monthly: SettlementReport['monthly'] }) {
  return (
    <section className={`${panel} mb-5 p-4 sm:p-5`}>
      <h2 className="font-black">월별 구독권 매출</h2>
      <p className="mt-1 text-xs text-muted">선택 기간에 포함된 거래를 월별로 모았습니다.</p>
      {monthly.length ? (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {monthly.map(([date, won]) => (
            <li key={date} className="flex justify-between gap-4 rounded-lg bg-canvas px-3 py-2 text-sm">
              <span className="text-muted">{date}</span>
              <strong className="tabular-nums">{formatKrw(won)}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">이 기간에 구독 결제가 없어요.</p>
      )}
    </section>
  )
}
