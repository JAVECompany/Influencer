import type { ActionResult } from '../../types/actionResult'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'
import { isAmountInRange } from '../core/isAmountInRange'
import { getApprovedCreatorAccount } from '../creator/creatorSelectors'

export interface ProductActions {
  addProduct: (name: string, detail: string, cost: number, media?: string) => ActionResult
  removeProduct: (id: string) => ActionResult
}

export const createProductSlice: AppStoreSlice<ProductActions> = (set, get) => ({
  addProduct(name, detail, cost, media = '') {
    const state = get()
    const a = getApprovedCreatorAccount(state)
    if (!a || !name.trim() || !detail.trim() || !isAmountInRange(cost, 1, 10000))
      return fail('상품 정보와 1~10,000 코인 가격을 입력해 주세요.')
    if (
      media &&
      (media.length > 400_000 || !/^data:(image\/(png|jpeg|webp)|video\/(mp4|webm));base64,/.test(media))
    )
      return fail('지원하는 사진 또는 영상 파일을 선택해 주세요.')
    const kind = media.startsWith('data:video/') ? 'video' : 'image'
    set({
      products: [
        ...state.products,
        {
          id: crypto.randomUUID(),
          owner: a.id,
          name: name.trim().slice(0, 60),
          detail: detail.trim().slice(0, 220),
          cost,
          media,
          kind,
          art: state.creators[a.id].art,
        },
      ],
    })
    return ok
  },

  removeProduct(id) {
    const state = get()
    const a = getApprovedCreatorAccount(state)
    if (!a || !state.products.some((p) => p.id === id && p.owner === a.id))
      return fail('상품을 찾을 수 없습니다.')
    set({ products: state.products.map((p) => (p.id === id ? { ...p, archived: true } : p)) })
    return ok
  },
})
