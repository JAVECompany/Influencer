import type { IProduct, ITransaction } from '../../types/commerce'

export const isPhysicalProduct = (product: IProduct) => product.fulfillment === 'shipping'

export function isProductForSale(product: IProduct, transactions: ITransaction[]) {
  return (
    !product.archived &&
    product.reviewStatus === 'approved' &&
    (!isPhysicalProduct(product) ||
      !transactions.some(
        (transaction) => transaction.type === 'product' && transaction.productId === product.id
      ))
  )
}
