import type { Product } from '../../types/commerce'

export function isProductVideo(product: Product) {
  return product.kind === 'video' || product.media?.startsWith('data:video/')
}
