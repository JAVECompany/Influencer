import { CircleDollarSign, Sparkles } from 'lucide-react'
import TransactionLedger from '../../../shared/components/transactions/TransactionLedger'
import FieldLabel from '../../../shared/components/ui/FieldLabel'
import PageTitle from '../../../shared/components/ui/PageTitle'
import StatCard from '../../../shared/components/ui/StatCard'
import { field } from '../../../shared/styles/controlStyles'
import type { PageProps } from '../../../shared/types/navigation'
import { formatKrw, formatNumber } from '../../../shared/utils/format'
import { useCreatorEarnings } from '../hooks/useCreatorEarnings'

export default function CreatorEarningsScreen({ account }: Pick<PageProps, 'account'>) {
  const { period, setPeriod, filtered, revenue, used } = useCreatorEarnings(account.id)
  return (
    <>
      <PageTitle
        label="TRANSACTIONS"
        title="수익 내역"
        subtitle="데모 거래 원장 · 수수료, 환불, 송금 정책은 협의 중입니다."
      >
        <FieldLabel title="조회 월">
          <input
            type="month"
            className={field}
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          />
        </FieldLabel>
      </PageTitle>
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <StatCard label="구독 결제 합계" value={formatKrw(revenue)} icon={CircleDollarSign} />
        <StatCard label="크리에이터 코인 소비" value={formatNumber(used) + ' 코인'} icon={Sparkles} />
      </div>
      <TransactionLedger items={filtered} />
    </>
  )
}
