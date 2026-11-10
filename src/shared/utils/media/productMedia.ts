import type { IProduct } from '../../types/commerce'

export function isProductVideo(product: IProduct) {
  return product.kind === 'video' || product.media?.startsWith('data:video/')
}
