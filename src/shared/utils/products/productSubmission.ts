import type { Failure } from '../../types/actionResult'
import type { Product, ProductSubmission } from '../../types/commerce'
import { fail } from '../actions/actionResults'
import { isAmountInRange } from '../validation/isAmountInRange'

export function prepareProduct(
  { name, detail, cost, media, fulfillment }: ProductSubmission,
  owner: string,
  art: number
): Product | Failure {
  if (!name.trim() || !detail.trim() || !isAmountInRange(cost, 1, 10000))
    return fail('상품 정보와 1~10,000 코인 가격을 입력해 주세요.')
  if (fulfillment === 'shipping' && !media.startsWith('data:image/'))
    return fail('실물 상품에는 상품 사진이 필요합니다.')
  if (
    media &&
    (media.length > 400_000 || !/^data:(image\/(png|jpeg|webp)|video\/(mp4|webm));base64,/.test(media))
  )
    return fail('지원하는 사진 또는 영상 파일을 선택해 주세요.')

  return {
    id: crypto.randomUUID(),
    owner,
    name: name.trim().slice(0, 60),
    detail: detail.trim().slice(0, 220),
    cost,
    media,
    kind: media.startsWith('data:video/') ? 'video' : 'image',
    fulfillment,
    reviewStatus: 'pending',
    art,
  }
}
