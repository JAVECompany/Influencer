import type { ProductReviewStatus } from '../types/commerce'

export const productReviewLabels: Record<ProductReviewStatus, string> = {
  pending: '검수 대기',
  approved: '승인',
  rejected: '반려·판매 중지',
}
