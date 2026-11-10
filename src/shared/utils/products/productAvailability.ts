import type { Product, Transaction } from '../../types/commerce'

export const isPhysicalProduct = (product: Product) => product.fulfillment === 'shipping'

export function isProductForSale(product: Product, transactions: Transaction[]) {
  return (
    !product.archived &&
    product.reviewStatus === 'approved' &&
    (!isPhysicalProduct(product) ||
      !transactions.some(
        (transaction) => transaction.type === 'product' && transaction.productId === product.id
      ))
  )
}
