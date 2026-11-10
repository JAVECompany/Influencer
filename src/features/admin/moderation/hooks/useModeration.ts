import { useState } from 'react'
import { isAccountDisabled } from '../../../../shared/store/account/accountSelectors'
import { useAppStore } from '../../../../shared/store/core/useAppStore'
import type { Content } from '../../../../shared/types/content'
import type { PageProps } from '../../../../shared/types/navigation'

export function useModeration(notify: PageProps['notify']) {
  const state = useAppStore()
  const [tab, setTab] = useState('content')
  const [preview, setPreview] = useState<string | null>(null)
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
    setPreview,
    posts,
    managedAccounts,
    creators: state.creators,
    togglePost,
    toggleAccount,
  }
}
