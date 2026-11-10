import type { FailureType } from '../../types/actionResult'
import type { IShippingAddress, SpendType, ITransaction } from '../../types/commerce'
import type { ISessionData } from '../../types/demoState'
import { fail } from '../actions/actionResults'
import { getActiveAccount } from '../auth/session'
import { isPublic } from '../creator/creatorAccess'
import { isPhysicalProduct, isProductForSale } from '../products/productAvailability'
import { drawRewardIndex } from '../roulette/roulette'
import { hasSubscription } from '../subscription/subscriptionAccess'
import { createTransaction } from '../transactions/createTransaction'

interface IPurchase {
  balance: number
  transaction: ITransaction
  reward: string
  rewardIndex?: number
}

function normalizeShippingAddress(address: IShippingAddress) {
  return {
    recipient: address.recipient.trim(),
    phone: address.phone.trim(),
    postalCode: address.postalCode.trim(),
    address: address.address.trim(),
    addressDetail: address.addressDetail.trim(),
  }
}

function isValidShippingAddress(address: IShippingAddress) {
  return (
    address.recipient.length > 0 &&
    address.recipient.length <= 50 &&
    /^0\d{8,10}$/.test(address.phone.replaceAll('-', '').replaceAll(' ', '')) &&
    /^\d{5}$/.test(address.postalCode) &&
    address.address.length > 0 &&
    address.address.length <= 160 &&
    address.addressDetail.length <= 100
  )
}

export function preparePurchase(
  state: ISessionData,
  creator: string,
  type: SpendType,
  productId?: string,
  address?: IShippingAddress
): IPurchase | FailureType {
  const account = getActiveAccount(state)
  if (
    account?.role !== 'customer' ||
    !isPublic(state, creator) ||
    !hasSubscription(state, account.id, creator)
  ) {
    return fail('구독 중인 고객만 이용할 수 있습니다.')
  }

  const guaranteed = type === 'roulette-guaranteed'
  const product =
    type === 'product'
      ? state.products.find((item) => item.id === productId && item.owner === creator)
      : undefined
  const roulette = type === 'roulette' || guaranteed ? state.roulettes[creator] : undefined
  const cost = guaranteed ? roulette?.topPrizeCost : (product || roulette)?.cost
  const balance = Object.hasOwn(state.balances, account.id) ? state.balances[account.id] ?? 0 : 0
  if (!cost || (product && !isProductForSale(product, state.transactions))) {
    return fail('현재 구매할 수 없는 상품입니다.')
  }
  if (product && state.transactions.some((t) => t.productId === productId && t.customer === account.id)) {
    return fail('이미 구매한 상품입니다.')
  }

  const physical = product && isPhysicalProduct(product)
  const shipping = physical && address ? normalizeShippingAddress(address) : undefined
  if (physical && (!shipping || !isValidShippingAddress(shipping))) {
    return fail('받는 분, 연락처, 5자리 우편번호와 주소를 확인해 주세요.')
  }
  if (balance < cost) {
    return fail('코인이 부족합니다. 스토어에서 충전할 수 있어요.')
  }

  const rewardIndex = roulette ? (guaranteed ? 0 : drawRewardIndex(roulette.rewards)) : undefined
  const reward = roulette && rewardIndex !== undefined ? roulette.rewards[rewardIndex]?.name : product?.name
  if (!reward) {
    return fail('상품을 찾을 수 없습니다.')
  }

  return {
    balance: balance - cost,
    reward,
    rewardIndex,
    transaction: createTransaction(roulette ? 'roulette' : 'product', creator, account.id, {
      coins: cost,
      productId,
      reward,
      guaranteed,
      ...(shipping ? { shipping } : {}),
    }),
  }
}
