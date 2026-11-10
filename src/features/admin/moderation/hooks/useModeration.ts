import { useState } from 'react'
import { isAccountDisabled } from '../../../../shared/utils/account/accountStatus'
import { useAccountStore } from '../../../../shared/store/account/account'
import { useContentStore } from '../../../../shared/store/content/content'
import { useCreatorStore } from '../../../../shared/store/creator/creator'
import { useProductStore } from '../../../../shared/store/products/product'
import type { Product, ProductReviewStatus } from '../../../../shared/types/commerce'
import type { Content } from '../../../../shared/types/content'
import type { PageProps } from '../../../../shared/types/navigation'

export function useModeration(notify: PageProps['notify']) {
  const accounts = useAccountStore((state) => state.accounts)
  const creators = useCreatorStore((state) => state.creators)
  const allPosts = useContentStore((state) => state.posts)
  const allProducts = useProductStore((state) => state.products)
  const accountData = { accounts, creators }
  const reviewProductAction = useProductStore((state) => state.reviewProduct)
  const managePost = useContentStore((state) => state.managePost)
  const toggleAccountAction = useAccountStore((state) => state.toggleAccount)
  const [tab, setTab] = useState<'content' | 'accounts' | 'products'>('content')
  const [preview, setPreview] = useState<string | null>(null)
  const [productPreview, setProductPreview] = useState<string | null>(null)
  const products = allProducts
    .filter((product) => !product.archived)
    .sort((a, b) => Number(b.reviewStatus === 'pending') - Number(a.reviewStatus === 'pending'))
  const reviewProduct = (product: Product, decision: Exclude<ProductReviewStatus, 'pending'>) => {
    const result = reviewProductAction(product.id, decision)
    notify(result, decision === 'approved' ? '상품 판매를 승인했어요.' : '상품을 판매 목록에서 제외했어요.')
    if (!result.error) {
      setProductPreview(null)
    }
  }
  const posts = [...allPosts].sort((a, b) => b.reports.length - a.reports.length || b.at - a.at)
  const accountIds = new Set(Object.keys(accounts))
  for (const creator of Object.values(creators)) {
    if (creator.status === 'approved') {
      accountIds.add(creator.id)
    }
  }
  const managedAccounts = [...accountIds].map((id) => ({
    id,
    account: accounts[id],
    creator: creators[id],
    disabled: isAccountDisabled(accountData, id),
  }))
  const previewPost = allPosts.find((post) => post.id === preview)
  const togglePost = (post: Content) =>
    notify(managePost(post.id, 'hide'), post.hidden ? '다시 공개했어요.' : '콘텐츠를 숨겼어요.')
  const toggleAccount = (id: string) =>
    notify(
      toggleAccountAction(id),
      isAccountDisabled(accountData, id) ? '이용을 복구했어요.' : '이용을 정지했어요.'
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
    creators,
    togglePost,
    toggleAccount,
  }
}
