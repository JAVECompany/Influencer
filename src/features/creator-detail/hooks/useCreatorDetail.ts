import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { canRead, isStoryAvailable } from '../../../shared/utils/content/contentAccess'
import { hasSubscription, subscriberCount } from '../../../shared/utils/subscription/subscriptionAccess'
import { isPublic } from '../../../shared/utils/creator/creatorAccess'
import { useContentAccessData } from '../../../shared/hooks/content/useContentAccessData'
import { useContentStore } from '../../../shared/store/content/content'
import { useProductStore } from '../../../shared/store/products/product'
import { useRouletteStore } from '../../../shared/store/roulette/roulette'
import { useSubscriptionStore } from '../../../shared/store/subscription/subscription'
import { useWalletStore } from '../../../shared/store/wallet/wallet'
import { isPhysicalProduct, isProductForSale } from '../../../shared/utils/products/productAvailability'
import type { Account } from '../../../shared/types/account'
import type { Notify } from '../../../shared/types/actionResult'
import type { ShippingAddress } from '../../../shared/types/commerce'
import { byRecent } from '../../../shared/utils/content/contentOrder'
import type { ShopOffer } from '../types/shopOffer'

export function useCreatorDetail(id: string, account: Account, notify: Notify) {
  const access = useContentAccessData()
  const { accounts, creators } = access
  const allPosts = useContentStore((state) => state.posts)
  const { transactions, balance } = useWalletStore(
    useShallow(({ transactions, balances }) => ({ transactions, balance: balances[account.id] ?? 0 }))
  )
  const allProducts = useProductStore((state) => state.products)
  const roulette = useRouletteStore((state) => state.roulettes[id])
  const subscribe = useSubscriptionStore((state) => state.subscribe)
  const spend = useWalletStore((state) => state.spend)
  const [preview, setPreview] = useState<string | null>(null)
  const [offer, setOffer] = useState<ShopOffer | null>(null)
  const creator = creators[id]
  const staff = account.role === 'admin'
  if (!creator || (!staff && !isPublic(access, id))) {
    return null
  }

  const active = staff || hasSubscription(access, account.id, id)
  const posts = allPosts
    .filter((p) => p.owner === id && canRead(access, p) && (staff || isStoryAvailable(p)))
    .sort(byRecent)
  const purchases = new Set(
    transactions.filter((t) => t.customer === account.id && t.type === 'product').map((t) => t.productId)
  )
  const products = allProducts.filter(
    (p) =>
      p.owner === id &&
      (staff || isProductForSale(p, transactions) || (p.reviewStatus !== 'rejected' && purchases.has(p.id)))
  )
  const previewPost = allPosts.find((post) => post.id === preview)
  const closeOffer = () => setOffer(null)
  const confirmOffer = (address?: ShippingAddress) => {
    if (offer?.type !== 'subscribe' && offer?.type !== 'product') {
      return
    }

    const result = offer.type === 'subscribe' ? subscribe(id) : spend(id, offer.type, offer.id, address)
    const message =
      offer.type === 'subscribe'
        ? '구독을 시작했어요.'
        : isPhysicalProduct(offer)
        ? '주문이 완료됐어요. 프로필에서 배송 상태를 확인할 수 있어요.'
        : '구매한 콘텐츠를 열 수 있어요.'
    notify(result, message)
    if (!result.error) {
      closeOffer()
    }
  }
  const playRoulette = (guaranteed: boolean) => spend(id, guaranteed ? 'roulette-guaranteed' : 'roulette')

  return {
    creator,
    creatorAccount: accounts[id],
    staff,
    active,
    posts,
    preview,
    previewPost,
    setPreview,
    offer,
    setOffer,
    closeOffer,
    purchases,
    products,
    roulette,
    balance,
    creators,
    accounts,
    subscribers: subscriberCount(access, id),
    confirmOffer,
    playRoulette,
  }
}
