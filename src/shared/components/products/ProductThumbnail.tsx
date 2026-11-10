import { ImageIcon, LockKeyhole, Video } from 'lucide-react'
import type { Product } from '../../types/commerce'
import { isProductVideo } from '../../utils/media/productMedia'
import DemoScene from '../ui/media/DemoScene'

export default function ProductThumbnail({
  product,
  locked,
  className = '',
}: {
  product: Product
  locked?: boolean
  className?: string
}) {
  const Type = isProductVideo(product) ? Video : ImageIcon
  return (
    <div
      data-product-thumbnail
      data-blurred-thumbnail={locked || undefined}
      className={`relative isolate shrink-0 overflow-hidden rounded-xl bg-raised ${className}`}
      aria-label={locked ? '흐리게 가린 상품 미리보기' : product.name + ' 미리보기'}
      role="img"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${locked ? 'scale-[1.3] blur-[18px]' : ''}`}
      >
        {product.media && !isProductVideo(product) ? (
          <img
            src={product.media}
            alt=""
            draggable={false}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : product.media && isProductVideo(product) ? (
          <video
            src={product.media}
            muted
            playsInline
            preload="metadata"
            className="size-full object-cover"
          />
        ) : (
          <DemoScene art={product.art} className="size-full" />
        )}
      </div>
      {locked && (
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center bg-media/30 text-on-media"
        >
          <LockKeyhole size={19} />
        </div>
      )}
      <Type
        aria-hidden="true"
        size={13}
        className="absolute right-2 bottom-2 rounded-sm bg-media/70 p-0.5 text-on-media"
      />
    </div>
  )
}
