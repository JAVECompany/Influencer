import { useState } from 'react'
import { isAccountDisabled } from '../../../../shared/utils/account/accountStatus'
import { useAppStore } from '../../../../shared/store/app'
import type { Product, ProductReviewStatus } from '../../../../shared/types/commerce'
import type { Content } from '../../../../shared/types/content'
import type { PageProps } from '../../../../shared/types/navigation'

export function useModeration(notify: PageProps['notify']) {
  const state = useAppStore()
  const [tab, setTab] = useState<'content' | 'accounts' | 'products'>('content')
  const [preview, setPreview] = useState<string | null>(null)
  const [productPreview, setProductPreview] = useState<string | null>(null)
  const products = state.products
    .filter((product) => !product.archived)
    .sort((a, b) => Number(b.reviewStatus === 'pending') - Number(a.reviewStatus === 'pending'))
  const reviewProduct = (product: Product, decision: Exclude<ProductReviewStatus, 'pending'>) => {
    const result = state.reviewProduct(product.id, decision)
    notify(result, decision === 'approved' ? '상품 판매를 승인했어요.' : '상품을 판매 목록에서 제외했어요.')
    if (!result.error) setProductPreview(null)
  }
  const posts = [...state.posts].sort((a, b) => b.reports.length - a.reports.length || b.at - a.at)
  const accountIds = new Set(Object.keys(state.accounts))
  for (const creator of Object.values(state.creators)) {
    if (creator.status === 'approved') accountIds.add(creator.id)
  }
  const managedAccounts = [...accountIds].map((id) => ({
    id,
    account: state.accounts[id],
    creator: state.creators[id],
    disabled: isAccountDisabled(state, id),
  }))
  const previewPost = state.posts.find((post) => post.id === preview)
  const togglePost = (post: Content) =>
    notify(state.managePost(post.id, 'hide'), post.hidden ? '다시 공개했어요.' : '콘텐츠를 숨겼어요.')
  const toggleAccount = (id: string) =>
    notify(
      state.toggleAccount(id),
      isAccountDisabled(state, id) ? '이용을 복구했어요.' : '이용을 정지했어요.'
    )

  return {
    tab,
    setTab,
    preview,
    previewPost,
    products,
    productPreview: products.find((product) => product.id === productPreview),
    setProductPreview,
    reviewProduct,
    setPreview,
    posts,
    managedAccounts,
    creators: state.creators,
    togglePost,
    toggleAccount,
  }
}
