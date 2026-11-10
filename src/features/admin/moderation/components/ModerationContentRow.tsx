import Button from '../../../../shared/components/ui/actions/Button'
import { contentKindLabels } from '../../../../shared/constants/contentKinds'
import type { IContent } from '../../../../shared/types/content'
import type { IPageProps } from '../../../../shared/types/navigation'

export default function ModerationContentRow({
  post,
  ownerName,
  openCreator,
  onPreview,
  onToggle,
}: {
  post: IContent
  ownerName: string
  openCreator: IPageProps['openCreator']
  onPreview: (id: string) => void
  onToggle: (post: IContent) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="text-sm font-black break-words">{post.title}</p>
        <p className="mt-1 text-xs text-muted">
          <button
            type="button"
            aria-label={ownerName + ' 크리에이터 상세'}
            onClick={() => openCreator(post.owner)}
            className="font-bold text-accent hover:underline"
          >
            {ownerName}
          </button>
          {' · '}
          {contentKindLabels[post.kind]} · 신고 {post.reports.length}건 · {post.hidden ? '숨김' : '공개'}
        </p>
      </div>
      <div className="flex gap-2">
        <Button tone="plain" onClick={() => onPreview(post.id)}>
          열람
        </Button>
        <Button tone="subtle" onClick={() => onToggle(post)}>
          {post.hidden ? '공개' : '숨김'}
        </Button>
      </div>
    </div>
  )
}
