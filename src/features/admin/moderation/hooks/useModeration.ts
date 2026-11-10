import { useState } from 'react'
import { useAppStore } from '../../../../shared/store/useAppStore'
import type { Account } from '../../../../shared/types/account'
import type { Content } from '../../../../shared/types/content'
import type { PageProps } from '../../../../shared/types/navigation'

export function useModeration(notify: PageProps['notify']) {
  const state = useAppStore()
  const [tab, setTab] = useState('content')
  const [preview, setPreview] = useState<string | null>(null)
  const posts = [...state.posts].sort((a, b) => b.reports.length - a.reports.length || b.at - a.at)
  const accounts = Object.values(state.accounts)
  const previewPost = state.posts.find((post) => post.id === preview)
  const togglePost = (post: Content) =>
    notify(state.managePost(post.id, 'hide'), post.hidden ? '다시 공개했어요.' : '콘텐츠를 숨겼어요.')
  const toggleAccount = (account: Account) =>
    notify(state.toggleAccount(account.id), account.disabled ? '이용을 복구했어요.' : '이용을 정지했어요.')

  return {
    tab,
    setTab,
    preview,
    previewPost,
    setPreview,
    posts,
    accounts,
    creators: state.creators,
    togglePost,
    toggleAccount,
  }
}
