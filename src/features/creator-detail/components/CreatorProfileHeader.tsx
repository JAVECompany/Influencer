import { UsersRound } from 'lucide-react'
import Avatar from '../../../shared/components/ui/Avatar'
import Badge from '../../../shared/components/ui/Badge'
import Button from '../../../shared/components/ui/Button'
import { panel } from '../../../shared/styles/controlStyles'
import type { Account, Creator } from '../../../shared/types/account'
import { formatKrw, formatNumber } from '../../../shared/utils/format'

export default function CreatorProfileHeader({
  creator,
  account,
  active,
  staff,
  subscribers,
  onSubscribe,
}: {
  creator: Creator
  account?: Account
  active: boolean
  staff: boolean
  subscribers: number
  onSubscribe: () => void
}) {
  return (
    <header className={`${panel} mb-6 overflow-hidden`}>
      <div className="h-24 bg-[radial-gradient(ellipse_at_top_right,#355d66,transparent_75%),linear-gradient(100deg,#182533,#101a2d)] sm:h-32" />
      <div className="px-5 pb-5 sm:px-7">
        <div className="-mt-9 mb-3 flex items-end justify-between gap-2">
          <Avatar person={creator} account={account} className="size-[76px] border-4 border-panel" />
          {active ? (
            <Badge>{staff ? '관리자 검수' : '구독 중'}</Badge>
          ) : (
            <Button onClick={onSubscribe}>{formatKrw(creator.price)} / 월 구독</Button>
          )}
        </div>
        <h1 className="text-2xl font-black">{creator.name}</h1>
        <p className="mt-1 text-sm text-dim">@{creator.handle}</p>
        <p className="mt-3 text-sm break-words">{creator.bio}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-dim">
          <UsersRound size={14} />
          구독자 {formatNumber(subscribers)}명
        </p>
      </div>
    </header>
  )
}
