import { field, panel } from '../../../../shared/styles/controlStyles'
import type { Account } from '../../../../shared/types/account'
import { formatKrw, formatNumber } from '../../../../shared/utils/format/format'
import type { SettlementReport, SettlementRow } from '../types/settlementReport'
import SettlementCreatorRow from './SettlementCreatorRow'

export default function SettlementCreatorTable({
  rows,
  total,
  accounts,
  query,
  onQueryChange,
  onEdit,
}: {
  rows: SettlementRow[]
  total: SettlementReport['total']
  accounts: Record<string, Account>
  query: string
  onQueryChange: (query: string) => void
  onEdit: (row: SettlementRow) => void
}) {
  return (
    <section className={`${panel} mb-5 overflow-hidden`}>
      <div className="flex flex-wrap items-end justify-between gap-3 p-4 sm:p-5">
        <div>
          <h2 className="font-black">크리에이터별 정산</h2>
          <p className="mt-1 text-xs text-muted">
            상품 구매와 룰렛에 실제 사용된 코인을 집계합니다. 직접 입력은 조회 기간과 크리에이터에만
            적용합니다.
          </p>
        </div>
        <input
          aria-label="정산 크리에이터 검색"
          className={`${field} sm:w-52`}
          placeholder="닉네임 또는 핸들"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div className="max-h-[540px] overflow-auto" tabIndex={0} aria-label="크리에이터 정산 표 스크롤">
        <table className="w-full min-w-[870px] border-collapse text-right text-xs tabular-nums">
          <thead className="sticky top-0 z-10 bg-raised text-muted">
            <tr className="[&>th]:px-3 [&>th]:py-3">
              <th scope="col" className="text-left">
                크리에이터
              </th>
              <th scope="col">고객 사용 코인</th>
              <th scope="col">사용 코인 환산액</th>
              <th scope="col">구독권 매출</th>
              <th scope="col">정산 코인</th>
              <th scope="col">코인 지급액</th>
              <th scope="col">플랫폼 수수료</th>
              <th scope="col">지급 예정</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <SettlementCreatorRow
                key={row.creator.id}
                row={row}
                account={accounts[row.creator.id]}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="p-5 text-sm text-muted">일치하는 크리에이터가 없어요.</p>}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line bg-canvas/50 px-4 py-3 text-xs text-muted">
        <span>
          선택 기간 코인 합계 <strong className="ml-1 text-foreground">{formatNumber(total.coins)}</strong>
        </span>
        <span>
          코인 정산 총액 <strong className="ml-1 text-foreground">{formatKrw(total.gross)}</strong>
        </span>
        <span>
          플랫폼 수수료 합계 <strong className="ml-1 text-foreground">{formatKrw(total.fee)}</strong>
        </span>
        <span>
          전체 지급 예정 <strong className="ml-1 text-accent">{formatKrw(total.due)}</strong>
        </span>
      </div>
    </section>
  )
}
