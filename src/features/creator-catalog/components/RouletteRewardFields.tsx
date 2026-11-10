import FieldLabel from '../../../shared/components/ui/forms/FieldLabel'
import { field } from '../../../shared/styles/controlStyles'
import type { DraftReward } from '../types/rouletteDraft'

export default function RouletteRewardFields({
  row,
  index,
  onChange,
}: {
  row: DraftReward
  index: number
  onChange: (changes: Partial<DraftReward>) => void
}) {
  return (
    <fieldset className="grid grid-cols-[minmax(0,1fr)_6rem] gap-2 rounded-xl bg-canvas p-3">
      <legend className="px-1 text-xs font-bold text-accent">
        {index + 1}번 상품{index === 0 ? ' · 1등' : ''}
      </legend>
      <FieldLabel title="상품명">
        <input
          required
          maxLength={60}
          className={field}
          value={row.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </FieldLabel>
      <FieldLabel title="당첨 확률 (%)">
        <input
          type="number"
          required
          min={1}
          max={99}
          className={field}
          value={row.chance}
          onChange={(e) => onChange({ chance: e.target.value })}
        />
      </FieldLabel>
    </fieldset>
  )
}
