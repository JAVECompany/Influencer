import ProductThumbnail from '../../../shared/components/products/ProductThumbnail'
import Button from '../../../shared/components/ui/Button'
import Modal from '../../../shared/components/ui/Modal'
import { formatKrw, formatNumber } from '../../../shared/utils/format'
import type { ShopOffer } from '../types/shopOffer'

export default function CreatorOfferDialog({
  offer,
  price,
  balance,
  onConfirm,
  onClose,
}: {
  offer: Extract<ShopOffer, { type: 'subscribe' | 'product' }>
  price: number
  balance: number
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal title={offer.name} onClose={onClose}>
      {offer.type === 'product' && (
        <ProductThumbnail product={offer} locked className="mb-4 aspect-video w-full" />
      )}
      <p className="mb-4 text-sm leading-relaxed text-dim">
        {offer.type === 'subscribe'
          ? formatKrw(price) + ' / 월 · 모의 구독을 시작할까요?'
          : formatNumber(offer.cost) + ' 코인 · 보유 ' + formatNumber(balance) + ' 코인'}
      </p>
      <Button className="w-full" onClick={onConfirm}>
        확인
      </Button>
    </Modal>
  )
}
