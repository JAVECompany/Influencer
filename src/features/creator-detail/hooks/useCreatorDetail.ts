import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { canRead, isStoryAvailable } from '../../../shared/utils/content/contentAccess'
import { hasSubscription, countSubscribers } from '../../../shared/utils/subscription/subscriptionAccess'
import { isPublic } from '../../../shared/utils/creator/creatorAccess'
import { useContentAccessData } from '../../../shared/hooks/content/useContentAccessData'
import { useContentStore } from '../../../shared/store/content/content'
import { useProductStore } from '../../../shared/store/products/product'
import { useRouletteStore } from '../../../shared/store/roulette/roulette'
import { useSubscriptionStore } from '../../../shared/store/subscription/subscription'
import { useWalletStore } from '../../../shared/store/wallet/wallet'
import { isPhysicalProduct, isProductForSale } from '../../../shared/utils/products/productAvailability'
import type { IAccount } from '../../../shared/types/account'
import type { NotifyType } from '../../../shared/types/actionResult'
import type { IShippingAddress } from '../../../shared/types/commerce'
import { compareByNewest } from '../../../shared/utils/content/contentOrder'
import type { ShopOfferType } from '../types/shopOffer'

export function useCreatorDetail(id: string, account: IAccount, notify: NotifyType) {
  const access = useContentAccessData()
  const { accounts, creators } = access
  const allPosts = useContentStore((s) => s.posts)
  const { transactions, balance } = useWalletStore(
    useShallow(({ transactions, balances }) => ({ transactions, balance: balances[account.id] ?? 0 }))
  )
  const allProducts = useProductStore((s) => s.products)
  const roulette = useRouletteStore((s) => s.roulettes[id])
  const subscribeToCreator = useSubscriptionStore((s) => s.subscribeToCreator)
  const spendCoins = useWalletStore((s) => s.spendCoins)
  const [preview, setPreview] = useState<string | null>(null)
  const [offer, setOffer] = useState<ShopOfferType | null>(null)
  const creator = creators[id]
  const staff = account.role === 'admin'
  if (!creator || (!staff && !isPublic(access, id))) {
    return null
  }

  const active = staff || hasSubscription(access, account.id, id)
  const posts = allPosts
    .filter((p) => p.owner === id && canRead(access, p) && (staff || isStoryAvailable(p)))
    .sort(compareByNewest)
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
  const confirmOffer = (address?: IShippingAddress) => {
    if (offer?.type !== 'subscribe' && offer?.type !== 'product') {
      return
    }

    const result =
      offer.type === 'subscribe' ? subscribeToCreator(id) : spendCoins(id, offer.type, offer.id, address)
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
  const playRoulette = (guaranteed: boolean) =>
    spendCoins(id, guaranteed ? 'roulette-guaranteed' : 'roulette')

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
    subscribers: countSubscribers(access, id),
    confirmOffer,
    playRoulette,
  }
}
