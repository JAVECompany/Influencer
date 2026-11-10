import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ActionResult } from '../../types/actionResult'
import type { PostAction, PublishInput } from '../../types/content'
import type { SessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { actor } from '../../utils/auth/session'
import { canRead, isStoryAvailable, tracksAudience } from '../../utils/content/contentAccess'
import { prepareContent } from '../../utils/content/contentSubmission'
import { getApprovedCreatorAccount } from '../../utils/creator/creatorAccess'
import { getDemoState, registerDemoStore } from '../persistence/demo'

export interface ContentField {
  posts: SessionData['posts']
}

interface ContentState extends ContentField {
  publish: (input: PublishInput) => ActionResult
  recordAudience: (id: string) => void
  managePost: (id: string, action: PostAction) => ActionResult
}

const initialState: ContentField = {
  posts: getDemoState().posts,
}

export const useContentStore = create<ContentState>()(
  immer((set) => ({
    ...initialState,

    publish(input) {
      const state = getDemoState()
      const a = getApprovedCreatorAccount(state)
      if (!a) {
        return fail('콘텐츠 제목과 내용을 입력해 주세요.')
      }

      const post = prepareContent(input, a.id, state.creators[a.id].art)
      if ('error' in post) {
        return post
      }

      set((draft) => {
        draft.posts.unshift(post)
      })
      return ok
    },

    recordAudience(id) {
      const state = getDemoState()
      const account = actor(state)
      if (account?.role !== 'customer') {
        return
      }

      const index = state.posts.findIndex((post) => post.id === id)
      const post = state.posts[index]
      if (!tracksAudience(post) || !canRead(state, post) || !isStoryAvailable(post)) {
        return
      }

      const viewers = post.viewers ?? []
      if (viewers.includes(account.id)) {
        return
      }

      set((draft) => {
        const viewers = (draft.posts[index].viewers ??= [])
        viewers.push(account.id)
      })
    },

    managePost(id, action) {
      const state = getDemoState()
      const a = actor(state)
      const index = state.posts.findIndex((item) => item.id === id)
      const post = state.posts[index]
      if (!post || !a) {
        return fail('콘텐츠를 찾을 수 없습니다.')
      }

      if (action === 'remove' && a.role === 'influencer' && a.id === post.owner) {
        set((draft) => {
          draft.posts.splice(index, 1)
        })
      } else if (action === 'hide' && a.role === 'admin') {
        set((draft) => {
          draft.posts[index].hidden = !post.hidden
        })
      } else if (['like', 'report'].includes(action) && a.role === 'customer' && canRead(state, post)) {
        set((draft) => {
          const target = draft.posts[index]
          if (action === 'like') {
            if (post.likes.includes(a.id)) {
              target.likes = post.likes.filter((id) => id !== a.id)
            } else {
              target.likes.push(a.id)
            }
          } else if (!post.reports.includes(a.id)) {
            target.reports.push(a.id)
          }
        })
      } else {
        return fail('해당 기능을 사용할 권한이 없습니다.')
      }
      return ok
    },
  }))
)

registerDemoStore(initialState, useContentStore)
