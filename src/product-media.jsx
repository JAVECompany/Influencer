import { ImageIcon, LockKeyhole, Video } from 'lucide-react'
import { Scene } from './ui'

function isVideo(product) {
  return product.kind === 'video' || product.media?.startsWith('data:video/')
}

export function ProductThumbnail({ product, className = '' }) {
  const Type = isVideo(product) ? Video : ImageIcon
  return <div data-blurred-thumbnail className={`relative isolate shrink-0 overflow-hidden rounded-xl bg-[#25323b] ${className}`} aria-label="흐리게 가린 상품 미리보기" role="img">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 scale-[1.3] blur-[18px]">
      {product.media && !isVideo(product) ? <img src={product.media} alt="" draggable={false} loading="lazy" className="size-full object-cover" /> :
        product.media && isVideo(product) ? <video src={product.media} muted playsInline preload="metadata" className="size-full object-cover" /> :
          <Scene art={product.art} className="size-full" />}
    </div>
    <div aria-hidden="true" className="absolute inset-0 grid place-items-center bg-night/30 text-white/85">
      <LockKeyhole size={19} />
      <Type size={13} className="absolute right-2 bottom-2 opacity-75" />
    </div>
  </div>
}

export function ProductMedia({ product }) {
  if (!product.media) return <Scene art={product.art} className="aspect-video w-full rounded-xl" />
  if (isVideo(product)) return <video src={product.media} controls playsInline preload="metadata" aria-label={product.name} className="max-h-[55dvh] w-full rounded-xl bg-black" />
  return <img src={product.media} alt={product.name} draggable={false} className="max-h-[55dvh] w-full rounded-xl bg-black object-contain" />
}
