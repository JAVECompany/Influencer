import { useContext, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { ImageIcon, LockKeyhole, Video } from 'lucide-react'
import { ContentPrivacy } from './content-privacy'
import { Protected, Scene } from './ui'
import type { Product } from './types'

function isVideo(product: Product) {
  return product.kind === 'video' || product.media?.startsWith('data:video/')
}

export function ProductThumbnail({ product, locked, className = '' }: { product: Product; locked?: boolean; className?: string }) {
  const Type = isVideo(product) ? Video : ImageIcon
  return <div data-product-thumbnail data-blurred-thumbnail={locked || undefined} className={`relative isolate shrink-0 overflow-hidden rounded-xl bg-[#25323b] ${className}`}
    aria-label={locked ? '흐리게 가린 상품 미리보기' : product.name + ' 미리보기'} role="img">
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${locked ? 'scale-[1.3] blur-[18px]' : ''}`}>
      {product.media && !isVideo(product) ? <img src={product.media} alt="" draggable={false} loading="lazy" className="size-full object-cover" /> :
        product.media && isVideo(product) ? <video src={product.media} muted playsInline preload="metadata" className="size-full object-cover" /> :
          <Scene art={product.art} className="size-full" />}
    </div>
    {locked && <div aria-hidden="true" className="absolute inset-0 grid place-items-center bg-night/30 text-white/85"><LockKeyhole size={19} /></div>}
    <Type aria-hidden="true" size={13} className="absolute right-2 bottom-2 rounded-sm bg-night/70 p-0.5 text-white" />
  </div>
}

export function ProductCard({ product, locked = false, children }: { product: Product; locked?: boolean; children: ReactNode }) {
  return <article className="grid items-center gap-3 rounded-xl bg-night p-3 sm:grid-cols-[100px_minmax(0,1fr)_auto]">
    <ProductThumbnail product={product} locked={locked} className="aspect-video w-full sm:w-[100px]" />
    <div className="min-w-0">
      <p className="text-sm font-bold break-words">{product.name}</p>
      <p className="mt-1 text-xs break-words text-dim">{product.detail}{product.archived && ' · 판매 종료'}</p>
    </div>
    <div className="flex flex-wrap items-center gap-2 sm:justify-end">{children}</div>
  </article>
}

export function ProductMedia({ product, viewer }: { product: Product; viewer: string }) {
  const mask = useContext(ContentPrivacy)
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (mask) video.current?.pause()
  }, [mask])

  return <Protected viewer={viewer} className="rounded-xl">
    {!product.media ? <Scene art={product.art} className="aspect-video w-full" /> :
      isVideo(product) ? <video ref={video} src={product.media} controls controlsList="nodownload noremoteplayback"
        disablePictureInPicture disableRemotePlayback playsInline preload="metadata" aria-label={product.name}
        onPlay={(event) => { if (mask) event.currentTarget.pause() }}
        className="max-h-[55dvh] w-full bg-black" /> :
        <img src={product.media} alt={product.name} draggable={false} className="max-h-[55dvh] w-full bg-black object-contain" />}
    <p className="mt-3 text-sm break-words text-dim">{product.detail}</p>
  </Protected>
}
