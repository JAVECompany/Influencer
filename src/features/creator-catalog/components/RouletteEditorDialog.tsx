import RouletteWheelDialog from '../../../shared/components/roulette/RouletteWheelDialog'
import Button from '../../../shared/components/ui/Button'
import FieldLabel from '../../../shared/components/ui/FieldLabel'
import Modal from '../../../shared/components/ui/Modal'
import { field } from '../../../shared/styles/controlStyles'
import type { Roulette } from '../../../shared/types/commerce'
import { useRouletteDraft } from '../hooks/useRouletteDraft'
import RouletteRewardFields from './RouletteRewardFields'

export default function RouletteEditorDialog({
  roulette,
  onClose,
  onSave,
}: {
  roulette?: Roulette
  onClose: () => void
  onSave: (settings: Roulette) => void
}) {
  const {
    cost,
    setCost,
    topPrice,
    setTopPrice,
    rows,
    preview,
    error,
    sum,
    draft,
    update,
    addReward,
    removeReward,
    openPreview,
    closePreview,
  } = useRouletteDraft(roulette)

  if (preview) return <RouletteWheelDialog roulette={preview} mode="preview" onClose={closePreview} />
  return (
    <Modal title="룰렛 설정" onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const settings = draft()
          onSave(settings)
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldLabel title="1회 이용 (코인)">
            <input
              type="number"
              min={1}
              max={10000}
              required
              className={field}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </FieldLabel>
          <FieldLabel title="1등 확정 구매 (코인)">
            <input
              type="number"
              min={1}
              max={10000}
              className={field}
              placeholder="미설정 시 숨김"
              value={topPrice}
              onChange={(e) => setTopPrice(e.target.value)}
            />
          </FieldLabel>
        </div>
        <p className="text-xs leading-relaxed text-dim">
          첫 상품이 1등입니다. 원판 표시 비중을 입력하면 실제 확률에 같은 값이 들어가며, 실제 확률은 직접
          수정할 수 있어요.
        </p>
        {rows.map((row, index) => (
          <RouletteRewardFields
            key={index}
            row={row}
            index={index}
            onChange={(changes) => update(index, changes)}
          />
        ))}
        <p className="text-xs text-dim">
          합계 · 표시 비중 {sum('displayChance')}% / 실제 확률 {sum('chance')}%
        </p>
        {error && (
          <p role="alert" className="text-sm text-red-200">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button tone="plain" disabled={rows.length === 8} onClick={addReward}>
            상품 추가
          </Button>
          <Button tone="plain" disabled={rows.length === 2} onClick={removeReward}>
            마지막 상품 제거
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button tone="subtle" onClick={openPreview}>
            미리보기
          </Button>
          <Button type="submit">룰렛 저장</Button>
        </div>
      </form>
    </Modal>
  )
}
