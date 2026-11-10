import Avatar from '../../../shared/components/ui/media/Avatar'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import type { IAccount } from '../../../shared/types/account'
import type { IContent } from '../../../shared/types/content'
import { formatNumber } from '../../../shared/utils/format/format'

export default function ContentAudienceDialog({
  post,
  viewers,
  onClose,
}: {
  post: IContent
  viewers: IAccount[]
  onClose: () => void
}) {
  return (
    <Modal title={post.kind === 'live' ? '라이브 참여자 명단' : '스토리 조회 고객 목록'} onClose={onClose}>
      <p className="text-sm font-bold break-words">
        {post.title} · {formatNumber(viewers.length)}명
      </p>
      {post.kind === 'live' && (
        <p className="mt-1 text-xs text-muted">이 데모에서는 라이브 미리보기를 연 고객을 집계합니다.</p>
      )}
      {viewers.length ? (
        <ul className="mt-4 grid gap-2">
          {viewers.map((viewer) => (
            <li
              key={viewer.id}
              className="flex items-center gap-3 rounded-xl bg-canvas p-2.5 text-sm font-bold"
            >
              <Avatar account={viewer} className="size-8" />
              <span className="min-w-0 break-words">{viewer.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted">아직 집계된 고객이 없어요.</p>
      )}
    </Modal>
  )
}
