import { Trash2 } from 'lucide-react'
import ProductCard from '../../../shared/components/products/ProductCard'
import Button from '../../../shared/components/ui/actions/Button'
import { productReviewLabels } from '../../../shared/constants/productReviewStatus'
import { panel } from '../../../shared/styles/controlStyles'
import type { Product } from '../../../shared/types/commerce'
import { formatNumber } from '../../../shared/utils/format/format'

export default function CreatorProductList({
  products,
  onPreview,
  onArchive,
}: {
  products: Product[]
  onPreview: (product: Product) => void
  onArchive: (product: Product) => void
}) {
  return (
    <div className={`${panel} mb-4 p-5`}>
      <h2 className="mb-3 font-black">개별 상품</h2>
      {!products.length && <p className="text-sm text-muted">등록된 상품이 없어요.</p>}
      <div className="grid gap-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p}>
            <span className="text-xs font-bold text-muted">{productReviewLabels[p.reviewStatus]}</span>
            <span className="text-xs text-muted">{formatNumber(p.cost)} 코인</span>
            <Button tone="subtle" onClick={() => onPreview(p)}>
              상품 미리보기
            </Button>
            <Button tone="plain" aria-label={p.name + ' 판매 종료'} onClick={() => onArchive(p)}>
              <Trash2 size={17} />
            </Button>
          </ProductCard>
        ))}
      </div>
    </div>
  )
}
