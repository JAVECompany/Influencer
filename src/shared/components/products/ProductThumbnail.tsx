import { ImageIcon, LockKeyhole, Video } from 'lucide-react'
import type { Product } from '../../types/commerce'
import { isProductVideo } from '../../utils/productMedia'
import DemoScene from '../ui/DemoScene'

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
      className={`relative isolate shrink-0 overflow-hidden rounded-xl bg-[#25323b] ${className}`}
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
          className="absolute inset-0 grid place-items-center bg-night/30 text-white/85"
        >
          <LockKeyhole size={19} />
        </div>
      )}
      <Type
        aria-hidden="true"
        size={13}
        className="absolute right-2 bottom-2 rounded-sm bg-night/70 p-0.5 text-white"
      />
    </div>
  )
}
