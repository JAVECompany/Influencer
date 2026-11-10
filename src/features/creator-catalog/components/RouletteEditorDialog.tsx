import RouletteWheelDialog from '../../../shared/components/roulette/RouletteWheelDialog'
import Button from '../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../shared/components/ui/forms/FieldLabel'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import { field } from '../../../shared/styles/controlStyles'
import type { IRoulette } from '../../../shared/types/commerce'
import { useRouletteDraft } from '../hooks/useRouletteDraft'
import RouletteRewardFields from './RouletteRewardFields'

export default function RouletteEditorDialog({
  roulette,
  onClose,
  onSave,
}: {
  roulette?: IRoulette
  onClose: () => void
  onSave: (settings: IRoulette) => void
}) {
  const {
    cost,
    setCost,
    topPrice,
    setTopPrice,
    rows,
    preview,
    error,
    totalChance,
    draft,
    update,
    addReward,
    removeReward,
    openPreview,
    closePreview,
  } = useRouletteDraft(roulette)

  if (preview) {
    return <RouletteWheelDialog roulette={preview} mode="preview" onClose={closePreview} />
  }

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
        <p className="text-xs leading-relaxed text-muted">
          첫 상품이 1등입니다. 상품별 당첨 확률에 따라 원판의 칸 크기가 정해집니다.
        </p>
        {rows.map((row, index) => (
          <RouletteRewardFields
            key={index}
            row={row}
            index={index}
            onChange={(changes) => update(index, changes)}
          />
        ))}
        <p className="text-xs text-muted">당첨 확률 합계 · {totalChance}%</p>
        {error && (
          <p role="alert" className="text-sm text-danger">
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
