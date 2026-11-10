import { useContext, useEffect, useRef } from 'react'
import { ContentPrivacyContext } from '../../contexts/contentPrivacyContext'
import type { IProduct } from '../../types/commerce'
import { isProductVideo } from '../../utils/media/productMedia'
import DemoScene from '../ui/media/DemoScene'
import ProtectedContent from '../ui/privacy/ProtectedContent'

export default function ProductMedia({ product }: { product: IProduct }) {
  const mask = useContext(ContentPrivacyContext)
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (mask) {
      video.current?.pause()
    }
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
            if (mask) {
              event.currentTarget.pause()
            }
          }}
          className="max-h-[55dvh] w-full bg-media"
        />
      ) : (
        <img
          src={product.media}
          alt={product.name}
          draggable={false}
          className="max-h-[55dvh] w-full bg-media object-contain"
        />
      )}
      <p className="mt-3 text-sm break-words text-muted">{product.detail}</p>
    </ProtectedContent>
  )
}
