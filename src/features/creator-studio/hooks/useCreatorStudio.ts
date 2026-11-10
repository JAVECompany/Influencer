import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { audienceForCreator } from '../../../shared/utils/content/contentAccess'
import { subscriberCount } from '../../../shared/utils/subscription/subscriptionAccess'
import { useContentAccessData } from '../../../shared/hooks/content/useContentAccessData'
import { useContentStore } from '../../../shared/store/content/content'
import { useCreatorStore } from '../../../shared/store/creator/creator'
import type { ActionResult } from '../../../shared/types/actionResult'
import type { Content, PublishInput } from '../../../shared/types/content'
import type { OperatorProps } from '../../../shared/types/navigation'

export function useCreatorStudio({ account, notify }: OperatorProps) {
  const access = useContentAccessData()
  const allPosts = useContentStore((state) => state.posts)
  const { publish: publishContent, managePost } = useContentStore(
    useShallow(({ publish, managePost }) => ({ publish, managePost }))
  )
  const editCreator = useCreatorStore((state) => state.editCreator)
  const [dialog, setDialog] = useState<'publish' | 'settings' | Content | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [audienceId, setAudienceId] = useState<string | null>(null)
  const creator = access.creators[account.id]
  const posts = allPosts.filter((p) => p.owner === account.id)
  const audiencePost = posts.find((p) => p.id === audienceId)
  const viewers = audienceForCreator(access, audiencePost)
  const finish = (result: ActionResult, message: string) => {
    notify(result, message)
    if (!result.error) {
      setDialog(null)
    }
  }
  const subscribers = subscriberCount(access, account.id)
  const previewPost = allPosts.find((post) => post.id === preview)
  const closeDialog = () => setDialog(null)
  const publish = (input: PublishInput) => finish(publishContent(input), '콘텐츠를 등록했어요.')
  const saveSettings = (price: number, bio: string) =>
    finish(editCreator(price, bio), '공개 프로필을 저장했어요.')
  const removePost = (id: string) => finish(managePost(id, 'remove'), '콘텐츠를 삭제했어요.')

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
