import { useState } from 'react'
import { canRead, isStoryAvailable } from '../../../shared/store/content/contentSelectors'
import { hasSubscription, subscriberCount } from '../../../shared/store/subscription/subscriptionSelectors'
import { isPublic } from '../../../shared/store/creator/creatorSelectors'
import { useAppStore } from '../../../shared/store/core/useAppStore'
import type { Account } from '../../../shared/types/account'
import type { Notify } from '../../../shared/types/actionResult'
import { byRecent } from '../../../shared/utils/content/contentOrder'
import type { ShopOffer } from '../types/shopOffer'

export function useCreatorDetail(id: string, account: Account, notify: Notify) {
  const state = useAppStore()
  const [preview, setPreview] = useState<string | null>(null)
  const [offer, setOffer] = useState<ShopOffer | null>(null)
  const creator = state.creators[id]
  const staff = account.role === 'admin'
  if (!creator || (!staff && !isPublic(state, id))) return null
  const active = staff || hasSubscription(state, account.id, id)
  const posts = state.posts
    .filter((p) => p.owner === id && canRead(state, p) && (staff || isStoryAvailable(p)))
    .sort(byRecent)
  const purchases = new Set(
    state.transactions
      .filter((t) => t.customer === account.id && t.type === 'product')
      .map((t) => t.productId)
  )
  const products = state.products.filter(
    (p) => p.owner === id && (staff || !p.archived || purchases.has(p.id))
  )
  const roulette = state.roulettes[id]
  const balance = state.balances[account.id] ?? 0
  const previewPost = state.posts.find((post) => post.id === preview)
  const closeOffer = () => setOffer(null)
  const confirmOffer = () => {
    if (offer?.type !== 'subscribe' && offer?.type !== 'product') return
    const result = offer.type === 'subscribe' ? state.subscribe(id) : state.spend(id, offer.type, offer.id)
    const success = { subscribe: '구독을 시작했어요.', product: '구매한 콘텐츠를 열 수 있어요.' }
    notify(result, success[offer.type])
    if (!result.error) closeOffer()
  }
  const playRoulette = (guaranteed: boolean) =>
    state.spend(id, guaranteed ? 'roulette-guaranteed' : 'roulette')

  return {
    creator,
    creatorAccount: state.accounts[id],
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
    creators: state.creators,
    accounts: state.accounts,
    subscribers: subscriberCount(state, id),
    confirmOffer,
    playRoulette,
  }
}
