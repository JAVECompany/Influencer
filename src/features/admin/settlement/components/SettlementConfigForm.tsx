import { Calculator } from 'lucide-react'
import Button from '../../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../../shared/components/ui/forms/FieldLabel'
import { field, panel } from '../../../../shared/styles/controlStyles'
import { formatNumber } from '../../../../shared/utils/format/format'

export default function SettlementConfigForm({
  coinWon,
  feeBps,
  onSave,
}: {
  coinWon: number
  feeBps: number
  onSave: (coinWon: number, fee: number) => void
}) {
  return (
    <section className={`${panel} mb-5 p-4 sm:p-5`}>
      <h2 className="mb-3 flex items-center gap-2 font-black">
        <Calculator size={17} className="text-accent" /> 코인 정산 기준
      </h2>
      <form
        key={coinWon + ':' + feeBps}
        className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          onSave(Number(data.get('unit')), Number(data.get('fee')))
        }}
      >
        <FieldLabel title="코인 환산 단가 (원 / 코인)">
          <input
            type="number"
            name="unit"
            min={1}
            max={10000}
            required
            className={field}
            defaultValue={coinWon}
          />
        </FieldLabel>
        <FieldLabel title="플랫폼 코인 수수료 (%)">
          <input
            type="number"
            name="fee"
            min={0}
            max={100}
            step="0.01"
            required
            className={field}
            defaultValue={feeBps / 100}
          />
        </FieldLabel>
        <Button type="submit">정산 기준 적용</Button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        현재 {formatNumber(coinWon)}원/코인 · {formatNumber(feeBps / 100)}%. 코인 충전 묶음 가격과 별개인 데모
        환산 단가입니다.
      </p>
    </section>
  )
}
