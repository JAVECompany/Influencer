import type { ProductReviewStatusType } from '../types/commerce'

export const productReviewLabels: Record<ProductReviewStatusType, string> = {
  pending: '검수 대기',
  approved: '승인',
  rejected: '반려·판매 중지',
}
