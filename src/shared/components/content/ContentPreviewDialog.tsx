import { useEffect } from 'react'
import { contentKindLabels } from '../../constants/contentKinds'
import { canRead, isStoryAvailable, tracksAudience } from '../../utils/content/contentAccess'
import { useAppStore } from '../../store/app'
import type { Account } from '../../types/account'
import type { Content } from '../../types/content'
import Badge from '../ui/display/Badge'
import Modal from '../ui/dialogs/Modal'
import ProtectedContent from '../ui/privacy/ProtectedContent'
import ContentMedia from './ContentMedia'

export default function ContentPreviewDialog({
  post,
  account,
  onClose,
}: {
  post?: Content
  account: Account
  onClose: () => void
}) {
  const state = useAppStore()
  const canOpen = Boolean(
    post && canRead(state, post) && (account.role !== 'customer' || isStoryAvailable(post))
  )
  const track = canOpen && account.role === 'customer' && tracksAudience(post)
  const id = post?.id
  const { recordAudience } = state
  useEffect(() => {
    if (track && id) recordAudience(id)
  }, [track, id, recordAudience])

  if (!post || !canOpen) return null
  return (
    <Modal title={post.title} onClose={onClose} protectedContent>
      <ProtectedContent className="rounded-xl">
        <ContentMedia post={post} />
        <div className="bg-canvas p-4">
          <Badge live={post.kind === 'live'}>{contentKindLabels[post.kind]} 미리보기</Badge>
          <p className="mt-2 text-sm leading-relaxed text-muted">{post.body}</p>
        </div>
      </ProtectedContent>
      {post.kind === 'live' && <p className="mt-3 text-xs text-muted">라이브 편성 미리보기 · 데모</p>}
    </Modal>
  )
}
