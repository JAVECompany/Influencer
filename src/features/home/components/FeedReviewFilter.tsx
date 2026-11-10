import Button from '../../../shared/components/ui/Button'
import { field, panel } from '../../../shared/styles/controlStyles'
import type { Creator } from '../../../shared/types/account'

export default function FeedReviewFilter({
  owner,
  creators,
  onOwnerChange,
  openCreator,
}: {
  owner: string
  creators: Creator[]
  onOwnerChange: (id: string) => void
  openCreator: (id: string) => void
}) {
  return (
    <div className={`${panel} mb-5 flex flex-wrap items-end gap-2 p-3`}>
      <label className="min-w-40 flex-1 text-xs font-bold text-dim">
        검수할 크리에이터
        <select
          className={`${field} mt-1`}
          value={owner}
          onChange={(event) => onOwnerChange(event.target.value)}
        >
          <option value="">모든 크리에이터</option>
          {creators.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · @{c.handle}
            </option>
          ))}
        </select>
      </label>
      <Button tone="subtle" disabled={!owner} onClick={() => openCreator(owner)}>
        프로필·상품 검수
      </Button>
    </div>
  )
}
