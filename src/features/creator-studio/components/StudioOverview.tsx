import { CircleDollarSign, Layers3, UsersRound } from 'lucide-react'
import Button from '../../../shared/components/ui/Button'
import StatCard from '../../../shared/components/ui/StatCard'
import { panel } from '../../../shared/styles/controlStyles'
import type { Creator } from '../../../shared/types/account'
import { formatKrw, formatNumber } from '../../../shared/utils/format'

export default function StudioOverview({
  creator,
  subscribers,
  postCount,
  onEdit,
}: {
  creator: Creator
  subscribers: number
  postCount: number
  onEdit: () => void
}) {
  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="구독자" value={formatNumber(subscribers) + '명'} icon={UsersRound} />
        <StatCard label="월 구독료" value={formatKrw(creator.price)} icon={CircleDollarSign} />
        <StatCard label="등록 콘텐츠" value={postCount + '개'} icon={Layers3} />
      </div>
      <section className={`${panel} mb-5 flex flex-wrap items-center justify-between gap-3 p-5`}>
        <div>
          <p className="font-black">공개 프로필</p>
          <p className="mt-1 text-sm break-words text-dim">
            @{creator.handle} · {creator.bio}
          </p>
        </div>
        <Button tone="subtle" onClick={onEdit}>
          구독료 · 소개 수정
        </Button>
      </section>
    </>
  )
}
