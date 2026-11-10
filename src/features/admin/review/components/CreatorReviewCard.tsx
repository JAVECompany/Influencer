import Avatar from '../../../../shared/components/ui/media/Avatar'
import Badge from '../../../../shared/components/ui/display/Badge'
import Button from '../../../../shared/components/ui/actions/Button'
import { creatorReviewStatus } from '../../../../shared/constants/creatorReviewStatus'
import { panel } from '../../../../shared/styles/controlStyles'
import type { IAccount, ICreator } from '../../../../shared/types/account'

export default function CreatorReviewCard({
  creator,
  account,
  onApprove,
  onReject,
}: {
  creator: ICreator
  account?: IAccount
  onApprove: (id: string) => void
  onReject: (creator: ICreator) => void
}) {
  return (
    <article className={`${panel} p-5`}>
      <div className="mb-3 flex items-center gap-3">
        <Avatar person={creator} account={account} className="size-10" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-black">{creator.name}</h2>
          <p className="text-xs text-muted">
            @{creator.handle} · {creator.method === 'link' ? '링크 접수' : '직접 입력'}
          </p>
        </div>
        <Badge>{creatorReviewStatus[creator.status]}</Badge>
      </div>
      {creator.instagram && (
        <a
          className="text-sm break-all text-accent underline"
          href={creator.instagram}
          target="_blank"
          rel="noreferrer"
        >
          Instagram 프로필 확인
        </a>
      )}
      {creator.email && (
        <p className="text-sm break-all text-muted">
          {creator.email} · {creator.bio}
        </p>
      )}
      {creator.reason && <p className="mt-2 text-sm text-muted">{creator.reason}</p>}
      {creator.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <Button onClick={() => onApprove(creator.id)}>승인</Button>
          <Button tone="danger" onClick={() => onReject(creator)}>
            반려
          </Button>
        </div>
      )}
    </article>
  )
}
