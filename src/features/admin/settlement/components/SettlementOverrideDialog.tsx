import Button from '../../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../../shared/components/ui/forms/FieldLabel'
import Modal from '../../../../shared/components/ui/dialogs/Modal'
import { field } from '../../../../shared/styles/controlStyles'
import { formatNumber } from '../../../../shared/utils/format/format'
import type { SettlementRowType } from '../types/settlementReport'

export default function SettlementOverrideDialog({
  row,
  start,
  end,
  onSave,
  onClose,
}: {
  row: SettlementRowType
  start: string
  end: string
  onSave: (coins: number | null) => void
  onClose: () => void
}) {
  return (
    <Modal title={row.creator.name + ' 정산 코인 입력'} onClose={onClose}>
      <p className="mb-4 text-sm text-muted">
        {start} ~ {end} · 원장에 기록된 사용 코인 {formatNumber(row.coins)}
      </p>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSave(Number(new FormData(event.currentTarget).get('coins')))
        }}
      >
        <FieldLabel title="정산에 적용할 코인">
          <input
            name="coins"
            type="number"
            required
            min={0}
            max={10000000}
            className={field}
            defaultValue={row.appliedCoins}
          />
        </FieldLabel>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">수동 입력 저장</Button>
          {row.adjusted !== undefined && (
            <Button tone="subtle" onClick={() => onSave(null)}>
              원장 수치로 복원
            </Button>
          )}
        </div>
      </form>
    </Modal>
  )
}
