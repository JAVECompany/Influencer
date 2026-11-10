import type { ReactNode } from 'react'
import type { Product } from '../../types/commerce'
import ProductThumbnail from './ProductThumbnail'

export default function ProductCard({
  product,
  locked = false,
  children,
}: {
  product: Product
  locked?: boolean
  children: ReactNode
}) {
  return (
    <article className="grid items-center gap-3 rounded-xl bg-night p-3 sm:grid-cols-[100px_minmax(0,1fr)_auto]">
      <ProductThumbnail product={product} locked={locked} className="aspect-video w-full sm:w-[100px]" />
      <div className="min-w-0">
        <p className="text-sm font-bold break-words">{product.name}</p>
        <p className="mt-1 text-xs break-words text-dim">
          {product.detail}
          {product.archived && ' · 판매 종료'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">{children}</div>
    </article>
  )
}
