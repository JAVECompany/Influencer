import ProductCard from '../../../../shared/components/products/ProductCard'
import ProductMedia from '../../../../shared/components/products/ProductMedia'
import Button from '../../../../shared/components/ui/actions/Button'
import Modal from '../../../../shared/components/ui/dialogs/Modal'
import { productReviewLabels } from '../../../../shared/constants/productReviewStatus'
import { panel } from '../../../../shared/styles/controlStyles'
import type { Creator } from '../../../../shared/types/account'
import type { Product, ProductReviewStatus } from '../../../../shared/types/commerce'
import { formatNumber } from '../../../../shared/utils/format/format'

export default function ProductReviewPanel({
  products,
  creators,
  preview,
  onPreview,
  onDecision,
}: {
  products: Product[]
  creators: Record<string, Creator>
  preview?: Product
  onPreview: (id: string | null) => void
  onDecision: (product: Product, decision: Exclude<ProductReviewStatus, 'pending'>) => void
}) {
  return (
    <section className={`${panel} grid gap-2 p-5`}>
      <p className="mb-2 text-sm text-muted">상품 사진·영상, 설명과 판매 조건을 확인한 뒤 결정해 주세요.</p>
      {!products.length && <p className="text-sm text-muted">등록된 상품이 없어요.</p>}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locked>
          <span className="text-xs text-muted">{creators[product.owner]?.name ?? product.owner}</span>
          <span className="text-xs font-bold">{productReviewLabels[product.reviewStatus]}</span>
          <Button tone="subtle" onClick={() => onPreview(product.id)}>
            상세 검수
          </Button>
        </ProductCard>
      ))}
      {preview && (
        <Modal title={preview.name} onClose={() => onPreview(null)} protectedContent>
          <ProductMedia product={preview} />
          <p className="my-4 text-sm text-muted">
            {formatNumber(preview.cost)} 코인 · {productReviewLabels[preview.reviewStatus]}
          </p>
          {preview.reviewStatus !== 'rejected' && (
            <div className="flex flex-wrap justify-end gap-2">
              <Button tone="danger" onClick={() => onDecision(preview, 'rejected')}>
                {preview.reviewStatus === 'pending' ? '반려' : '판매 중지'}
              </Button>
              {preview.reviewStatus === 'pending' && (
                <Button onClick={() => onDecision(preview, 'approved')}>판매 승인</Button>
              )}
            </div>
          )}
        </Modal>
      )}
    </section>
  )
}
