import { ShoppingBag } from 'lucide-react'
import ProductCard from '../../../shared/components/products/ProductCard'
import Button from '../../../shared/components/ui/actions/Button'
import { isPhysicalProduct } from '../../../shared/utils/products/productAvailability'
import { panel } from '../../../shared/styles/controlStyles'
import type { Product, Roulette } from '../../../shared/types/commerce'
import { formatNumber } from '../../../shared/utils/format/format'
import type { ShopOffer } from '../types/shopOffer'

export default function CreatorShop({
  products,
  roulette,
  purchases,
  staff,
  onOffer,
}: {
  products: Product[]
  roulette?: Roulette
  purchases: Set<string | undefined>
  staff: boolean
  onOffer: (offer: ShopOffer) => void
}) {
  return (
    <section className={`${panel} p-5`}>
      <h2 className="mb-3 flex items-center gap-2 font-black">
        <ShoppingBag size={18} className="text-accent" /> 크리에이터 상점
      </h2>
      {!products.length && !roulette && <p className="text-sm text-muted">등록된 상품이 없어요.</p>}
      <div className="grid gap-2">
        {products.map((p) => {
          const physical = isPhysicalProduct(p)
          const purchased = purchases.has(p.id)
          const unlocked = staff || purchased
          const label = staff
            ? '상품 검수 보기'
            : purchased
            ? physical
              ? '주문 완료'
              : '구매 콘텐츠 열기'
            : formatNumber(p.cost) + ' 코인'
          return (
            <ProductCard key={p.id} product={p} locked={!physical && !unlocked}>
              <Button
                tone="subtle"
                disabled={physical && purchased && !staff}
                onClick={() => onOffer({ ...p, type: unlocked ? 'owned' : 'product' })}
              >
                {label}
              </Button>
            </ProductCard>
          )
        })}
        {roulette && (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-canvas p-3">
            <div>
              <p className="text-sm font-bold">크리에이터 룰렛</p>
              <p className="mt-1 text-xs text-muted">
                {formatNumber(roulette.cost)} 코인으로 원판을 돌릴 수 있어요.
              </p>
            </div>
            <Button tone="subtle" className="shrink-0" onClick={() => onOffer({ type: 'roulette' })}>
              {staff ? '룰렛 검수' : '원판 열기'}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
