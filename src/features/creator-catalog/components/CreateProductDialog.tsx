import Button from '../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../shared/components/ui/forms/FieldLabel'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import { field } from '../../../shared/styles/controlStyles'
import type { Notify } from '../../../shared/types/actionResult'
import { readFormValue } from '../../../shared/utils/forms/formData'
import { readMediaFile } from '../../../shared/utils/media/readMediaFile'

export default function CreateProductDialog({
  onCreate,
  notify,
  onClose,
}: {
  onCreate: (name: string, detail: string, cost: number, media: string) => void
  notify: Notify
  onClose: () => void
}) {
  return (
    <Modal title="개별 상품 등록" onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          const file = data.get('media')
          try {
            const media = file instanceof File && file.size ? await readMediaFile(file, true) : ''
            onCreate(
              readFormValue(data, 'name'),
              readFormValue(data, 'detail'),
              Number(data.get('cost')),
              media
            )
          } catch (error) {
            notify({ error: error instanceof Error ? error.message : '파일을 읽을 수 없습니다.' })
          }
        }}
      >
        <FieldLabel title="상품명">
          <input name="name" required maxLength={60} className={field} />
        </FieldLabel>
        <FieldLabel title="상품 설명">
          <input
            name="detail"
            required
            maxLength={220}
            className={field}
            placeholder="예시 · 미공개 사진 3장"
          />
        </FieldLabel>
        <FieldLabel title="가격 (코인)">
          <input name="cost" type="number" required min={1} max={10000} className={field} />
        </FieldLabel>
        <FieldLabel title="구매 콘텐츠 사진·영상 (선택 · 280 KB 이하)">
          <input
            name="media"
            type="file"
            accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
            className={field}
          />
        </FieldLabel>
        <Button type="submit">상품 등록</Button>
      </form>
    </Modal>
  )
}
