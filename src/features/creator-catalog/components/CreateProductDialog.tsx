import { useState } from 'react'
import Button from '../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../shared/components/ui/forms/FieldLabel'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import { field } from '../../../shared/styles/controlStyles'
import type { Notify } from '../../../shared/types/actionResult'
import type { ProductFulfillment, ProductSubmission } from '../../../shared/types/commerce'
import { readFormValue } from '../../../shared/utils/forms/formData'
import { readMediaFile } from '../../../shared/utils/media/readMediaFile'

export default function CreateProductDialog({
  onCreate,
  notify,
  onClose,
}: {
  onCreate: (submission: ProductSubmission) => void
  notify: Notify
  onClose: () => void
}) {
  const [fulfillment, setFulfillment] = useState<ProductFulfillment>('digital')
  const [submitting, setSubmitting] = useState(false)
  const physical = fulfillment === 'shipping'

  return (
    <Modal title="개별 상품 등록" onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault()
          if (submitting) {
            return
          }

          const data = new FormData(event.currentTarget)
          const file = data.get('media')
          setSubmitting(true)
          try {
            const media = file instanceof File && file.size ? await readMediaFile(file, !physical) : ''
            onCreate({
              name: readFormValue(data, 'name'),
              detail: readFormValue(data, 'detail'),
              cost: Number(data.get('cost')),
              media,
              fulfillment,
            })
          } catch (error) {
            notify({ error: error instanceof Error ? error.message : '파일을 읽을 수 없습니다.' })
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <p className="text-sm text-muted">관리자가 승인하면 상점에 표시돼요.</p>
        <FieldLabel title="상품 유형">
          <select
            className={field}
            value={fulfillment}
            onChange={(event) =>
              setFulfillment(event.currentTarget.value === 'shipping' ? 'shipping' : 'digital')
            }
          >
            <option value="digital">디지털 콘텐츠</option>
            <option value="shipping">배송하는 실물 상품 · 1개</option>
          </select>
        </FieldLabel>
        <FieldLabel title="상품명">
          <input name="name" required maxLength={60} className={field} />
        </FieldLabel>
        <FieldLabel title="상품 설명">
          <input
            name="detail"
            required
            maxLength={220}
            className={field}
            placeholder={physical ? '예시 · 포토카드 1장, 상태와 구성' : '예시 · 미공개 사진 3장'}
          />
        </FieldLabel>
        <FieldLabel title="가격 (코인)">
          <input name="cost" type="number" required min={1} max={10000} className={field} />
        </FieldLabel>
        <FieldLabel
          title={
            physical ? '실물 상품 사진 (필수 · 280 KB 이하)' : '구매 콘텐츠 사진·영상 (선택 · 280 KB 이하)'
          }
        >
          <input
            key={fulfillment}
            name="media"
            type="file"
            required={physical}
            accept={
              physical
                ? 'image/png,image/jpeg,image/webp'
                : 'image/png,image/jpeg,image/webp,video/mp4,video/webm'
            }
            className={field}
          />
        </FieldLabel>
        <Button type="submit" disabled={submitting}>
          검수 요청
        </Button>
      </form>
    </Modal>
  )
}
