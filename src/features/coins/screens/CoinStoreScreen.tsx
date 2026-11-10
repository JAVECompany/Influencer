import { Coins } from 'lucide-react'
import TransactionLedger from '../../../shared/components/transactions/TransactionLedger'
import Button from '../../../shared/components/ui/actions/Button'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import PageTitle from '../../../shared/components/ui/layout/PageTitle'
import { coinPacks } from '../../../shared/constants/coinPacks'
import { panel } from '../../../shared/styles/controlStyles'
import type { PageProps } from '../../../shared/types/navigation'
import { formatKrw, formatNumber } from '../../../shared/utils/format/format'
import { useCoinStore } from '../hooks/useCoinStore'

export default function CoinStoreScreen({ account, notify }: Pick<PageProps, 'account' | 'notify'>) {
  const { balance, transactions, pack, setPack, close, topUp } = useCoinStore({ account, notify })
  return (
    <>
      <PageTitle title="코인 스토어" />
      <div className={`${panel} mb-5 flex items-center justify-between theme-balance p-5 sm:p-6`}>
        <div>
          <p className="text-sm text-muted">내 보유 코인</p>
          <p className="mt-2 text-3xl font-black tabular-nums">
            {formatNumber(balance)} <span className="text-sm text-accent">코인</span>
          </p>
        </div>
        <Coins size={34} className="text-accent" />
      </div>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {coinPacks.map((item) => (
          <article key={item.coins} className={`${panel} flex flex-col gap-3 p-4`}>
            <p className="text-xs font-bold text-muted">{item.name}</p>
            <p className="text-xl font-black">{formatNumber(item.coins)} 코인</p>
            <Button tone="subtle" onClick={() => setPack(item)}>
              {formatKrw(item.won)} · 충전
            </Button>
          </article>
        ))}
      </div>
      <TransactionLedger title="나의 거래 내역" items={transactions} />
      {pack && (
        <Modal title="코인 충전" onClose={close}>
          <p className="mb-4 text-sm text-muted">
            {formatNumber(pack.coins)} 코인을 모의 충전합니다. 실제로 청구되는 금액은 없습니다.
          </p>
          <Button className="w-full" onClick={topUp}>
            {formatKrw(pack.won)} · 모의 결제
          </Button>
        </Modal>
      )}
    </>
  )
}
