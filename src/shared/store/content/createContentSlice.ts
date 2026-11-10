import type { ActionResult } from '../../types/actionResult'
import type { Content, PostAction, PublishInput } from '../../types/content'
import { actor } from '../auth/authSelectors'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'
import { getApprovedCreatorAccount } from '../creator/creatorSelectors'
import { canRead, isStoryAvailable, tracksAudience } from './contentSelectors'

export interface ContentActions {
  publish: (input: PublishInput) => ActionResult
  recordAudience: (id: string) => void
  managePost: (id: string, action: PostAction) => ActionResult
}

export const createContentSlice: AppStoreSlice<ContentActions> = (set, get) => ({
  publish({ title, body, kind, media = '' }) {
    const state = get()
    const a = getApprovedCreatorAccount(state)
    if (!a || !title.trim() || !body.trim() || !['post', 'story', 'live'].includes(kind))
      return fail('콘텐츠 제목과 내용을 입력해 주세요.')
    if (media && (media.length > 400_000 || !/^data:image\/(png|jpeg|webp);base64,/.test(media)))
      return fail('지원하는 이미지 파일을 선택해 주세요.')
    const post: Content = {
      id: crypto.randomUUID(),
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
})
