import { ReceiptText } from 'lucide-react'
import { useAccountStore } from '../../store/account/account'
import { useCreatorStore } from '../../store/creator/creator'
import { panel } from '../../styles/controlStyles'
import type { Transaction, TransactionType } from '../../types/commerce'
import { formatKrw, formatNumber, formatRelativeTime } from '../../utils/format/format'

const txnNames: Record<TransactionType, string> = {
  subscribe: '구독 시작',
  unsubscribe: '구독 해지',
  topup: '코인 충전',
  product: '상품 구매',
  roulette: '룰렛 참여',
}

const settlementDate = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Seoul',
})

export default function TransactionLedger({
  title = '거래 내역',
  items,
  showParties = false,
  absoluteDates = false,
}: {
  title?: string
  items: Transaction[]
  showParties?: boolean
  absoluteDates?: boolean
}) {
  const accounts = useAccountStore((state) => state.accounts)
  const creators = useCreatorStore((state) => state.creators)
  return (
    <section className={`${panel} overflow-hidden`}>
      <h2 className="flex items-center gap-2 px-5 py-4 font-black">
        <ReceiptText size={17} className="text-accent" /> {title}
      </h2>
      {!items.length && (
        <p className="border-t border-line p-5 text-sm text-muted">표시할 거래 내역이 없어요.</p>
      )}
      {items.map((t) => (
        <div key={t.id} className="flex items-center justify-between gap-4 border-t border-line px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-bold break-words">
              {t.guaranteed ? '룰렛 1등 확정 구매' : txnNames[t.type]}
              {t.reward && ' · ' + t.reward}
            </p>
            <p className="mt-1 text-xs break-words text-muted">
              {[
                showParties && (accounts[t.customer]?.name ?? t.customer),
                t.owner && creators[t.owner]?.name,
                absoluteDates ? settlementDate.format(t.at) : formatRelativeTime(t.at),
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
          <p className="shrink-0 text-right text-sm font-bold text-accent">
            {t.coins
              ? (t.type === 'topup' ? '+' : '−') + formatNumber(t.coins) + ' 코인'
              : t.won
              ? formatKrw(t.won)
              : '—'}
          </p>
        </div>
      ))}
    </section>
  )
}
