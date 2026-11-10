import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { coinPacks } from '../constants/coinPacks'
import { initialData } from '../data/initialData'
import type { ProfileChanges } from '../types/account'
import type { Failure, Success } from '../types/actionResult'
import type { Transaction, TransactionType } from '../types/commerce'
import type { Content } from '../types/content'
import type { SessionData } from '../types/demoState'
import { displayShare, drawRewardIndex, rouletteConfigurationError } from '../utils/roulette'
import { actor, canRead, hasSubscription, isPublic, isStoryAvailable, tracksAudience } from './appSelectors'
import type { AppStore } from './appStoreTypes'
import { migrateDemoState } from './migrateDemoState'

const uid = () => crypto.randomUUID()

const fail = (error: string): Failure => ({ error })

const ok: Success = { success: true }

const amount = (n: number, min: number, max: number) => Number.isInteger(n) && n >= min && n <= max

const approved = (state: SessionData) => {
  const account = actor(state)
  return account?.role === 'influencer' && isPublic(state, account.id) ? account : null
}

type TransactionChanges = Partial<Pick<Transaction, 'won' | 'coins' | 'productId' | 'reward' | 'guaranteed'>>

const txn = (
  type: TransactionType,
  owner: string | null,
  customer: string,
  changes: TransactionChanges
): Transaction => ({ id: uid(), type, owner, customer, at: Date.now(), ...changes })

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

const validInstagram = (value: string) => {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      ['www.instagram.com', 'instagram.com'].includes(url.hostname) &&
      /^\/[a-z0-9_.]+\/?$/i.test(url.pathname) &&
      !['p', 'reels', 'reel', 'stories', 'accounts', 'explore', 'direct'].includes(
        url.pathname.split('/')[1].toLowerCase()
      )
    )
  } catch {
    return false
  }
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialData,
      session: null,

      signIn(id, password) {
        const account = get().accounts[id.trim().toLowerCase()]
        if (!account || account.password !== password) return fail('아이디와 비밀번호를 확인해 주세요.')
        if (account.disabled) return fail('이용이 정지된 계정입니다.')
        set({ session: account.id })
        return ok
      },

      signOut() {
        set({ session: null })
      },

      signUp({ id, password, name, terms, adult, role }) {
        const state = get()
        const key = id.trim().toLowerCase()
        const nickname = name.trim()
        if (!terms || !adult) return fail('약관 동의와 모의 성인 확인이 필요합니다.')
        if (!/^[a-z0-9_]{4,24}$/.test(key) || Object.hasOwn(state.accounts, key))
          return fail('사용할 수 없는 아이디입니다.')
        if (password.length < 6 || password.length > 72) return fail('비밀번호는 6~72자로 입력해 주세요.')
        if (
          !nickname ||
          nickname.length > 20 ||
          Object.values(state.accounts).some((a) => sameName(a.name, nickname)) ||
          Object.values(state.creators).some((c) => sameName(c.name, nickname))
        )
          return fail('중복되지 않는 닉네임을 입력해 주세요.')
        if (role !== 'customer' && role !== 'influencer') return fail('가입 유형을 선택해 주세요.')
        set({
          accounts: {
            ...state.accounts,
            [key]: {
              id: key,
              name: nickname,
              password,
              role,
              avatar: '',
              payment: '',
              notifications: true,
              disabled: false,
            },
          },
          session: key,
        })
        return ok
      },

      profile(changes) {
        const state = get()
        const a = actor(state)
        if (!a) return fail('로그인이 필요합니다.')
        const update: ProfileChanges = {}
        if (typeof changes.name === 'string') {
          const name = changes.name.trim()
          const taken =
            Object.values(state.accounts).some((item) => item.id !== a.id && sameName(item.name, name)) ||
            Object.values(state.creators).some((item) => item.id !== a.id && sameName(item.name, name))
          if (!name || name.length > 20 || taken) return fail('중복되지 않는 닉네임을 입력해 주세요.')
          update.name = name
        }
        if (typeof changes.avatar === 'string') {
          if (
            changes.avatar.length > 400_000 ||
            (changes.avatar && !/^data:image\/(png|jpeg|webp);base64,/.test(changes.avatar))
          ) {
            return fail('PNG, JPG 또는 WEBP 이미지를 280 KB 이하로 선택해 주세요.')
          }
          update.avatar = changes.avatar
        }
        if (typeof changes.notifications === 'boolean') update.notifications = changes.notifications
        if (typeof changes.payment === 'string') update.payment = changes.payment.trim().slice(0, 24)
        if (changes.password) {
          if (a.password !== changes.current) return fail('현재 비밀번호를 확인해 주세요.')
          if (changes.password.length < 6 || changes.password.length > 72)
            return fail('비밀번호는 6~72자로 입력해 주세요.')
          update.password = changes.password
        }
        const creator = state.creators[a.id]
        set({
          accounts: { ...state.accounts, [a.id]: { ...a, ...update } },
          creators:
            creator && update.name
              ? { ...state.creators, [a.id]: { ...creator, name: update.name } }
              : state.creators,
        })
        return ok
      },

      apply({ method, instagram, name, handle, email, bio }) {
        const state = get()
        const a = actor(state)
        const current = a && state.creators[a.id]
        if (a?.role !== 'influencer' || current?.status === 'approved' || current?.status === 'pending')
          return fail('현재 입점 신청을 변경할 수 없습니다.')
        if (method === 'link' && !validInstagram(instagram))
          return fail('https://www.instagram.com/사용자이름 형식으로 입력해 주세요.')
        const normalized =
          method === 'link'
            ? new URL(instagram).pathname.split('/')[1].toLowerCase()
            : handle.trim().toLowerCase()
        if (
          !/^[a-z0-9_.]{1,30}$/.test(normalized) ||
          Object.values(state.creators).some((c) => c.id !== a.id && c.handle === normalized)
        ) {
          return fail('사용 가능한 Instagram 핸들을 입력해 주세요.')
        }
        if (
          method === 'direct' &&
          (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !bio.trim())
        ) {
          return fail('표시 이름, 연락 이메일 및 소개를 입력해 주세요.')
        }
        const display = method === 'link' ? a.name : name.trim()
        if (
          display.length > 20 ||
          Object.values(state.creators).some((c) => c.id !== a.id && sameName(c.name, display)) ||
          Object.values(state.accounts).some((user) => user.id !== a.id && sameName(user.name, display))
        ) {
          return fail('중복되지 않는 표시 이름을 입력해 주세요.')
        }
        set({
          creators: {
            ...state.creators,
            [a.id]: {
              id: a.id,
              name: display,
              handle: normalized,
              bio: method === 'direct' ? bio.trim().slice(0, 240) : '밤결의 새로운 크리에이터.',
              email: method === 'direct' ? email.trim() : '',
              instagram: method === 'link' ? instagram.trim() : '',
              method,
              price: 5900,
              fans: 0,
              art: Object.keys(state.creators).length % 9,
              status: 'pending',
              reason: '',
            },
          },
        })
        return ok
      },

      review(id, status, reason = '') {
        const state = get()
        const creator = state.creators[id]
        if (
          actor(state)?.role !== 'admin' ||
          creator?.status !== 'pending' ||
          !['approved', 'rejected'].includes(status)
        )
          return fail('심사할 수 없는 신청입니다.')
        if (status === 'rejected' && !reason.trim()) return fail('반려 사유를 입력해 주세요.')
        set({
          creators: { ...state.creators, [id]: { ...creator, status, reason: reason.trim().slice(0, 180) } },
        })
        return ok
      },

      configureSettlement(coinWon, feeBps) {
        const state = get()
        if (actor(state)?.role !== 'admin') return fail('관리자만 정산 기준을 설정할 수 있습니다.')
        if (!amount(coinWon, 1, 10000) || !amount(feeBps, 0, 10000))
          return fail('코인 단가와 0~100% 수수료를 확인해 주세요.')
        set({ settlement: { ...state.settlement, coinWon, feeBps } })
        return ok
      },

      overrideSettlementCoins(periodKey, id, coins) {
        const state = get()
        if (
          actor(state)?.role !== 'admin' ||
          !state.creators[id] ||
          !/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(periodKey)
        ) {
          return fail('정산 기간과 크리에이터를 확인해 주세요.')
        }
        if (coins !== null && !amount(coins, 0, 10_000_000))
          return fail('0~10,000,000 사이의 정수 코인을 입력해 주세요.')
        const overrides = { ...state.settlement.overrides }
        const manual = { ...overrides[periodKey] }
        if (coins === null) delete manual[id]
        else manual[id] = coins
        if (Object.keys(manual).length) overrides[periodKey] = manual
        else delete overrides[periodKey]
        set({ settlement: { ...state.settlement, overrides } })
        return ok
      },

      toggleAccount(id) {
        const state = get()
        const a = actor(state)
        const target = state.accounts[id]
        if (a?.role !== 'admin' || !target || target.role === 'admin')
          return fail('계정 상태를 변경할 수 없습니다.')
        set({ accounts: { ...state.accounts, [id]: { ...target, disabled: !target.disabled } } })
        return ok
      },

      editCreator(price, bio) {
        const state = get()
        const a = approved(state)
        if (!a || !amount(price, 1000, 100000) || !bio.trim())
          return fail('소개와 1,000~100,000원 사이의 월 구독료를 입력해 주세요.')
        set({
          creators: {
            ...state.creators,
            [a.id]: { ...state.creators[a.id], price, bio: bio.trim().slice(0, 240) },
          },
        })
        return ok
      },

      publish({ title, body, kind, media = '' }) {
        const state = get()
        const a = approved(state)
        if (!a || !title.trim() || !body.trim() || !['post', 'story', 'live'].includes(kind))
          return fail('콘텐츠 제목과 내용을 입력해 주세요.')
        if (media && (media.length > 400_000 || !/^data:image\/(png|jpeg|webp);base64,/.test(media)))
          return fail('지원하는 이미지 파일을 선택해 주세요.')
        const post: Content = {
          id: uid(),
          owner: a.id,
          kind,
          title: title.trim().slice(0, 80),
          body: body.trim().slice(0, 500),
          media,
          at: Date.now(),
          art: state.creators[a.id].art,
          likes: [],
          reports: [],
          hidden: false,
        }
        set({ posts: [post, ...state.posts] })
        return ok
      },

      recordAudience(id) {
        const state = get()
        const account = actor(state)
        if (account?.role !== 'customer') return
        const index = state.posts.findIndex((post) => post.id === id)
        const post = state.posts[index]
        if (!tracksAudience(post) || !canRead(state, post) || !isStoryAvailable(post)) return
        const viewers = post.viewers ?? []
        if (viewers.includes(account.id)) return
        const posts = [...state.posts]
        posts[index] = { ...post, viewers: [...viewers, account.id] }
        set({ posts })
      },

      managePost(id, action) {
        const state = get()
        const a = actor(state)
        const post = state.posts.find((item) => item.id === id)
        if (!post || !a) return fail('콘텐츠를 찾을 수 없습니다.')
        if (action === 'remove' && a.role === 'influencer' && a.id === post.owner) {
          set({ posts: state.posts.filter((item) => item.id !== id) })
        } else if (action === 'hide' && a.role === 'admin') {
          set({
            posts: state.posts.map((item) => (item.id === id ? { ...item, hidden: !item.hidden } : item)),
          })
        } else if (['like', 'report'].includes(action) && a.role === 'customer' && canRead(state, post)) {
          const changes =
            action === 'like'
              ? {
                  likes: post.likes.includes(a.id)
                    ? post.likes.filter((name) => name !== a.id)
                    : [...post.likes, a.id],
                }
              : { reports: post.reports.includes(a.id) ? post.reports : [...post.reports, a.id] }
          set({ posts: state.posts.map((item) => (item.id === id ? { ...item, ...changes } : item)) })
        } else {
          return fail('해당 기능을 사용할 권한이 없습니다.')
        }
        return ok
      },

      subscribe(id) {
        const state = get()
        const a = actor(state)
        if (a?.role !== 'customer' || !isPublic(state, id)) return fail('구독할 수 없는 계정입니다.')
        const list = state.subscriptions[a.id] ?? []
        if (list.includes(id)) return fail('이미 구독 중입니다.')
        const price = state.creators[id].price
        set({
          subscriptions: { ...state.subscriptions, [a.id]: [...list, id] },
          transactions: [txn('subscribe', id, a.id, { won: price }), ...state.transactions],
        })
        return ok
      },

      unsubscribe(id) {
        const state = get()
        const a = actor(state)
        if (a?.role !== 'customer') return fail('구독 내역을 찾을 수 없습니다.')
        const list = state.subscriptions[a.id] ?? []
        if (!list.includes(id)) return fail('구독 내역을 찾을 수 없습니다.')
        set({
          subscriptions: { ...state.subscriptions, [a.id]: list.filter((item) => item !== id) },
          transactions: [txn('unsubscribe', id, a.id, {}), ...state.transactions],
        })
        return ok
      },

      topUp(coins) {
        const state = get()
        const a = actor(state)
        const pack = coinPacks.find((item) => item.coins === coins)
        if (a?.role !== 'customer' || !pack) return fail('충전할 수 없는 묶음입니다.')
        set({
          balances: { ...state.balances, [a.id]: (state.balances[a.id] ?? 0) + coins },
          transactions: [txn('topup', null, a.id, { coins, won: pack.won }), ...state.transactions],
        })
        return ok
      },

      addProduct(name, detail, cost, media = '') {
        const state = get()
        const a = approved(state)
        if (!a || !name.trim() || !detail.trim() || !amount(cost, 1, 10000))
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
              id: uid(),
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
        const a = approved(state)
        if (!a || !state.products.some((p) => p.id === id && p.owner === a.id))
          return fail('상품을 찾을 수 없습니다.')
        set({ products: state.products.map((p) => (p.id === id ? { ...p, archived: true } : p)) })
        return ok
      },

      saveRoulette(cost, rewards, topPrizeCost = null) {
        const state = get()
        const a = approved(state)
        if (!a) return fail('룰렛을 설정할 권한이 없습니다.')
        const error = rouletteConfigurationError(cost, rewards, topPrizeCost)
        if (error) return fail(error)
        set({
          roulettes: {
            ...state.roulettes,
            [a.id]: {
              cost,
              topPrizeCost,
              rewards: rewards.map((r) => ({
                name: r.name.trim().slice(0, 60),
                chance: r.chance,
                displayChance: displayShare(r),
              })),
            },
          },
        })
        return ok
      },

      spend(creator, type, productId) {
        const state = get()
        const a = actor(state)
        if (a?.role !== 'customer' || !hasSubscription(state, a.id, creator))
          return fail('구독 중인 고객만 이용할 수 있습니다.')
        const guaranteed = type === 'roulette-guaranteed'
        const product =
          type === 'product'
            ? state.products.find((p) => p.id === productId && p.owner === creator && !p.archived)
            : undefined
        const roulette = type === 'roulette' || guaranteed ? state.roulettes[creator] : undefined
        const cost = guaranteed ? roulette?.topPrizeCost : (product || roulette)?.cost
        const balance = state.balances[a.id] ?? 0
        if (!cost) return fail('판매가 종료되었습니다.')
        if (product && state.transactions.some((t) => t.productId === productId && t.customer === a.id))
          return fail('이미 구매한 상품입니다.')
        if (balance < cost) return fail('코인이 부족합니다. 스토어에서 충전할 수 있어요.')
        const rewardIndex = roulette ? (guaranteed ? 0 : drawRewardIndex(roulette.rewards)) : undefined
        const reward =
          roulette && rewardIndex !== undefined ? roulette.rewards[rewardIndex]?.name : product?.name
        if (!reward) return fail('상품을 찾을 수 없습니다.')
        set({
          balances: { ...state.balances, [a.id]: balance - cost },
          transactions: [
            txn(roulette ? 'roulette' : 'product', creator, a.id, {
              coins: cost,
              productId,
              reward,
              guaranteed,
            }),
            ...state.transactions,
          ],
        })
        return { success: true, reward, rewardIndex }
      },

      sendMessage(counterpart, text) {
        const state = get()
        const a = actor(state)
        if (!a || !['customer', 'influencer'].includes(a.role) || !text.trim())
          return fail('메시지를 보낼 수 없습니다.')
        const customer = a.role === 'customer' ? a.id : counterpart
        const creator = a.role === 'influencer' ? a.id : counterpart
        if (state.accounts[customer]?.disabled || !hasSubscription(state, customer, creator))
          return fail('활성 구독에서 채팅할 수 있습니다.')
        set({
          messages: [
            ...state.messages,
            { id: uid(), customer, creator, from: a.id, text: text.trim().slice(0, 500), at: Date.now() },
          ],
        })
        return ok
      },
    }),
    {
      name: 'bamgyeol-demo-v1',
      version: 1,
      migrate: migrateDemoState,
      partialize: ({
        accounts,
        creators,
        posts,
        subscriptions,
        balances,
        transactions,
        products,
        roulettes,
        messages,
        session,
        settlement,
      }) => ({
        accounts,
        creators,
        posts,
        subscriptions,
        balances,
        transactions,
        products,
        roulettes,
        messages,
        session,
        settlement,
      }),
    }
  )
)
