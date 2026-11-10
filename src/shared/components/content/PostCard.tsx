import { Flag, Heart, LockKeyhole, MessageCircle } from 'lucide-react'
import { canRead } from '../../utils/content/contentAccess'
import { useAppStore } from '../../store/app'
import { panel } from '../../styles/controlStyles'
import type { Content } from '../../types/content'
import type { FeedProps } from '../../types/feed'
import { formatRelativeTime } from '../../utils/format/format'
import Avatar from '../ui/media/Avatar'
import Button from '../ui/actions/Button'
import ProtectedContent from '../ui/privacy/ProtectedContent'
import ContentMedia from './ContentMedia'

const iconAction =
  'grid size-10 place-items-center rounded-xl text-muted transition hover:bg-foreground/5 hover:text-foreground'

export default function PostCard({
  post,
  account,
  openCreator,
  openChat,
  notify,
}: FeedProps & { post: Content }) {
  const state = useAppStore()
  const creator = state.creators[post.owner]
  if (!creator || !canRead(state, post)) return null
  const staff = account.role === 'admin'
  const liked = post.likes.includes(account.id)
  const reported = post.reports.includes(account.id)
  return (
    <article className={`${panel} overflow-hidden`}>
      <header className="flex items-center justify-between gap-2 px-4 py-3.5">
        <button onClick={() => openCreator(creator.id)} className="flex min-w-0 items-center gap-3 text-left">
          <Avatar person={creator} account={state.accounts[creator.id]} className="size-10" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-black">{creator.name}</span>
            <span className="text-xs text-muted">
              @{creator.handle} · {formatRelativeTime(post.at)}
            </span>
          </span>
        </button>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-[10px] font-bold text-accent">
          <LockKeyhole size={12} />
          {staff ? (post.hidden ? '숨김 · 검수 중' : '관리자 검수') : '구독자 전용'}
        </span>
      </header>
      <ProtectedContent>
        <ContentMedia post={post} />
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-[17px] font-black">{post.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed break-words text-muted">{post.body}</p>
        </div>
      </ProtectedContent>
      {staff ? (
        <footer className="flex items-center justify-between gap-2 px-4 py-2">
          <span className="text-xs text-muted">신고 {post.reports.length}건</span>
          <Button
            tone="subtle"
            onClick={() =>
              notify(
                state.managePost(post.id, 'hide'),
                post.hidden ? '콘텐츠를 다시 공개했어요.' : '콘텐츠를 숨겼어요.'
              )
            }
          >
            {post.hidden ? '다시 공개' : '숨김'}
          </Button>
        </footer>
      ) : (
        <footer className="flex items-center gap-1 px-3 py-2">
          <button
            type="button"
            aria-label="좋아요"
            aria-pressed={liked}
            className={iconAction}
            onClick={() => state.managePost(post.id, 'like')}
          >
            <Heart
              size={20}
              fill={liked ? 'currentColor' : 'none'}
              className={liked ? 'text-like' : undefined}
            />
          </button>
          {post.likes.length > 0 && <span className="text-xs text-muted">{post.likes.length}</span>}
          <button type="button" aria-label="채팅" className={iconAction} onClick={() => openChat(creator.id)}>
            <MessageCircle size={19} />
          </button>
          <button
            type="button"
            aria-label={reported ? '신고 완료' : '게시글 신고'}
            disabled={reported}
            className={`ml-auto ${iconAction}`}
            onClick={() => notify(state.managePost(post.id, 'report'), '운영팀 검토 목록에 등록했어요.')}
          >
            <Flag size={17} />
          </button>
        </footer>
      )}
    </article>
  )
}
