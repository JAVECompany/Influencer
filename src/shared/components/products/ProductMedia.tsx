import { useContext, useEffect, useRef } from 'react'
import { ContentPrivacyContext } from '../../contexts/contentPrivacyContext'
import type { Product } from '../../types/commerce'
import { isProductVideo } from '../../utils/productMedia'
import DemoScene from '../ui/DemoScene'
import ProtectedContent from '../ui/ProtectedContent'

export default function ProductMedia({ product }: { product: Product }) {
  const mask = useContext(ContentPrivacyContext)
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (mask) video.current?.pause()
  }, [mask])

  return (
    <ProtectedContent className="rounded-xl">
      {!product.media ? (
        <DemoScene art={product.art} className="aspect-video w-full" />
      ) : isProductVideo(product) ? (
        <video
          ref={video}
          src={product.media}
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          playsInline
          preload="metadata"
          aria-label={product.name}
          onPlay={(event) => {
            if (mask) event.currentTarget.pause()
          }}
          className="max-h-[55dvh] w-full bg-black"
        />
      ) : (
        <img
          src={product.media}
          alt={product.name}
          draggable={false}
          className="max-h-[55dvh] w-full bg-black object-contain"
        />
      )}
      <p className="mt-3 text-sm break-words text-dim">{product.detail}</p>
    </ProtectedContent>
  )
}
