import { Eye, Trash2, UsersRound } from 'lucide-react'
import Button from '../../../shared/components/ui/actions/Button'
import { contentKindLabels } from '../../../shared/constants/contentKinds'
import { audienceForCreator, tracksAudience } from '../../../shared/store/content/contentSelectors'
import { useAppStore } from '../../../shared/store/core/useAppStore'
import { panel } from '../../../shared/styles/controlStyles'
import type { Content } from '../../../shared/types/content'
import { formatNumber, formatRelativeTime } from '../../../shared/utils/format/format'

export default function StudioContentList({
  posts,
  onAudience,
  onPreview,
  onDelete,
}: {
  posts: Content[]
  onAudience: (id: string) => void
  onPreview: (id: string) => void
  onDelete: (post: Content) => void
}) {
  const state = useAppStore()
  return (
    <section className={`${panel} divide-y divide-line`}>
      <h2 className="p-5 font-black">내 콘텐츠</h2>
      {!posts.length && <p className="p-5 text-sm text-muted">등록된 콘텐츠가 없어요.</p>}
      {posts.map((p) => {
        const label = p.kind === 'live' ? '참여자' : '조회 고객'
        return (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="text-sm font-bold break-words">{p.title}</p>
              <p className="mt-1 text-xs text-muted">
                {contentKindLabels[p.kind]} · {formatRelativeTime(p.at)}
                {p.hidden && ' · 운영자 숨김'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tracksAudience(p) && (
                <Button tone="subtle" onClick={() => onAudience(p.id)}>
                  <UsersRound size={16} aria-hidden="true" />
                  {label} {formatNumber(audienceForCreator(state, p).length)}명
                </Button>
              )}
              <Button tone="plain" aria-label={p.title + ' 미리보기'} onClick={() => onPreview(p.id)}>
                <Eye size={17} />
              </Button>
              <Button tone="plain" aria-label={p.title + ' 삭제'} onClick={() => onDelete(p)}>
                <Trash2 size={17} />
              </Button>
            </div>
          </div>
        )
      })}
    </section>
  )
}
