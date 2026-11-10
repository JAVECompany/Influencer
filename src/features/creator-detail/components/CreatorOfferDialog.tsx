import ProductThumbnail from '../../../shared/components/products/ProductThumbnail'
import Button from '../../../shared/components/ui/actions/Button'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import { isPhysicalProduct } from '../../../shared/utils/products/productAvailability'
import type { ShippingAddress } from '../../../shared/types/commerce'
import { formatKrw, formatNumber } from '../../../shared/utils/format/format'
import { readFormValue } from '../../../shared/utils/forms/formData'
import type { ShopOffer } from '../types/shopOffer'
import ShippingAddressFields from './ShippingAddressFields'

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
  onConfirm: (address?: ShippingAddress) => void
  onClose: () => void
}) {
  const physical = offer.type === 'product' && isPhysicalProduct(offer)
  return (
    <Modal title={offer.name} onClose={onClose}>
      {offer.type === 'product' && (
        <ProductThumbnail product={offer} locked={!physical} className="mb-4 aspect-video w-full" />
      )}
      <p className="mb-4 text-sm leading-relaxed text-muted">
        {offer.type === 'subscribe'
          ? formatKrw(price) + ' / 월 · 모의 구독을 시작할까요?'
          : formatNumber(offer.cost) + ' 코인 · 보유 ' + formatNumber(balance) + ' 코인'}
      </p>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (!physical) {
            onConfirm()
            return
          }
          const data = new FormData(event.currentTarget)
          onConfirm({
            recipient: readFormValue(data, 'recipient'),
            phone: readFormValue(data, 'phone'),
            postalCode: readFormValue(data, 'postalCode'),
            address: readFormValue(data, 'address'),
            addressDetail: readFormValue(data, 'addressDetail'),
          })
        }}
      >
        {physical && <ShippingAddressFields />}
        <Button type="submit" className="w-full">
          {physical ? '코인으로 주문' : '확인'}
        </Button>
      </form>
    </Modal>
  )
}
