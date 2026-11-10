import type { ActionResult } from '../../types/actionResult'
import type { ProductReviewStatus, ProductSubmission } from '../../types/commerce'
import { prepareProduct } from '../../utils/products/productSubmission'
import { actor } from '../../utils/auth/session'
import { fail, ok } from '../../utils/actions/actionResults'
import type { AppStoreSlice } from '../types'
import { getApprovedCreatorAccount } from '../../utils/creator/creatorAccess'

export interface ProductActions {
  addProduct: (submission: ProductSubmission) => ActionResult
  removeProduct: (id: string) => ActionResult
  reviewProduct: (id: string, decision: Exclude<ProductReviewStatus, 'pending'>) => ActionResult
  markProductShipped: (transactionId: string) => ActionResult
}

export const createProductSlice: AppStoreSlice<ProductActions> = (set, get) => ({
  addProduct(submission) {
    const state = get()
    const a = getApprovedCreatorAccount(state)
    if (!a) return fail('상품 정보와 1~10,000 코인 가격을 입력해 주세요.')
    const product = prepareProduct(submission, a.id, state.creators[a.id].art)
    if ('error' in product) return product
    set((draft) => {
      draft.products.push(product)
    })
    return ok
  },

  reviewProduct(id, decision) {
    const state = get()
    const index = state.products.findIndex((p) => p.id === id)
    const product = state.products[index]
    if (
      actor(state)?.role !== 'admin' ||
      !product ||
      product.archived ||
      product.reviewStatus === 'rejected' ||
      (decision === 'approved' && product.reviewStatus !== 'pending')
    )
      return fail('검수 상태를 변경할 수 없는 상품입니다.')
    set((draft) => {
      draft.products[index].reviewStatus = decision
    })
    return ok
  },

  markProductShipped(transactionId) {
    const state = get()
    const seller = actor(state)
    const index = state.transactions.findIndex((t) => t.id === transactionId && t.owner === seller?.id)
    const order = state.transactions[index]
    if (
      seller?.role !== 'influencer' ||
      order?.type !== 'product' ||
      !order.shipping ||
      order.shipping.shippedAt
    )
      return fail('발송 처리할 수 없는 주문입니다.')
    const shipping = { ...order.shipping, shippedAt: Date.now() }
    set((draft) => {
      draft.transactions[index].shipping = shipping
    })
    return ok
  },

  removeProduct(id) {
    const state = get()
    const a = getApprovedCreatorAccount(state)
    if (!a) return fail('상품을 찾을 수 없습니다.')
    const index = state.products.findIndex((p) => p.id === id && p.owner === a.id)
    if (index === -1) return fail('상품을 찾을 수 없습니다.')
    set((draft) => {
      draft.products[index].archived = true
    })
    return ok
  },
})
