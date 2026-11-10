import { useState } from 'react'
import { audienceForCreator } from '../../../shared/utils/content/contentAccess'
import { subscriberCount } from '../../../shared/utils/subscription/subscriptionAccess'
import { useAppStore } from '../../../shared/store/app'
import type { ActionResult } from '../../../shared/types/actionResult'
import type { Content, PublishInput } from '../../../shared/types/content'
import type { OperatorProps } from '../../../shared/types/navigation'

export function useCreatorStudio({ account, notify }: OperatorProps) {
  const state = useAppStore()
  const [dialog, setDialog] = useState<'publish' | 'settings' | Content | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [audienceId, setAudienceId] = useState<string | null>(null)
  const creator = state.creators[account.id]
  const posts = state.posts.filter((p) => p.owner === account.id)
  const audiencePost = posts.find((p) => p.id === audienceId)
  const viewers = audienceForCreator(state, audiencePost)
  const finish = (result: ActionResult, message: string) => {
    notify(result, message)
    if (!result.error) setDialog(null)
  }
  const subscribers = subscriberCount(state, account.id)
  const previewPost = state.posts.find((post) => post.id === preview)
  const closeDialog = () => setDialog(null)
  const publish = (input: PublishInput) => finish(state.publish(input), '콘텐츠를 등록했어요.')
  const saveSettings = (price: number, bio: string) =>
    finish(state.editCreator(price, bio), '공개 프로필을 저장했어요.')
  const removePost = (id: string) => finish(state.managePost(id, 'remove'), '콘텐츠를 삭제했어요.')

  return {
    dialog,
    setDialog,
    preview,
    previewPost,
    setPreview,
    setAudienceId,
    creator,
    posts,
    audiencePost,
    viewers,
    subscribers,
    closeDialog,
    publish,
    saveSettings,
    removePost,
  }
}
