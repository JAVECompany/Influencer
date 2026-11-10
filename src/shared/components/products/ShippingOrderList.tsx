import { useProductStore } from '../../store/products/product'
import { useWalletStore } from '../../store/wallet/wallet'
import { panel } from '../../styles/controlStyles'
import type { IAccount } from '../../types/account'
import type { NotifyType } from '../../types/actionResult'
import { formatNumber } from '../../utils/format/format'
import Button from '../ui/actions/Button'

export default function ShippingOrderList({ account, notify }: { account: IAccount; notify: NotifyType }) {
  const transactions = useWalletStore((s) => s.transactions)
  const markProductShipped = useProductStore((s) => s.markProductShipped)
  const seller = account.role === 'influencer'
  const orders = transactions.filter(
    (order) =>
      order.type === 'product' &&
      order.shipping &&
      (seller ? order.owner === account.id : order.customer === account.id)
  )

  return (
    <section className={`${panel} mb-5 p-5`}>
      <h2 className="mb-3 font-black">{seller ? '배송 주문' : '실물 주문 내역'}</h2>
      {!orders.length && <p className="text-sm text-muted">배송 주문이 없어요.</p>}
      <ul className="grid gap-2">
        {orders.map((order) => {
          const shipping = order.shipping
          if (!shipping) {
            return null
          }

          return (
            <li key={order.id} className="rounded-xl bg-canvas p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold break-words">{order.reward}</p>
                <span className="text-xs text-muted">
                  {formatNumber(order.coins ?? 0)} 코인 · {shipping.shippedAt ? '발송 완료' : '배송 준비'}
                </span>
              </div>
              <p className="mt-2 text-xs break-words text-muted">
                {shipping.recipient} · {shipping.phone}
              </p>
              <p className="mt-1 text-xs break-words text-muted">
                ({shipping.postalCode}) {shipping.address} {shipping.addressDetail}
              </p>
              {seller && !shipping.shippedAt && (
                <Button
                  tone="subtle"
                  className="mt-3"
                  onClick={() => notify(markProductShipped(order.id), '발송 완료로 표시했어요.')}
                >
                  발송 완료 처리
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
