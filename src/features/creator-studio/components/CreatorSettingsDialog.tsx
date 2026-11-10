import Button from '../../../shared/components/ui/Button'
import FieldLabel from '../../../shared/components/ui/FieldLabel'
import Modal from '../../../shared/components/ui/Modal'
import { field } from '../../../shared/styles/controlStyles'
import type { Creator } from '../../../shared/types/account'
import { readFormValue } from '../../../shared/utils/formData'

export default function CreatorSettingsDialog({
  creator,
  onSave,
  onClose,
}: {
  creator: Creator
  onSave: (price: number, bio: string) => void
  onClose: () => void
}) {
  return (
    <Modal title="공개 프로필 설정" onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          onSave(Number(data.get('price')), readFormValue(data, 'bio'))
        }}
      >
        <FieldLabel title="월 구독료 (원)">
          <input
            name="price"
            required
            type="number"
            min={1000}
            max={100000}
            defaultValue={creator.price}
            className={field}
          />
        </FieldLabel>
        <FieldLabel title="소개">
          <textarea
            name="bio"
            required
            maxLength={240}
            rows={3}
            defaultValue={creator.bio}
            className={field}
          />
        </FieldLabel>
        <Button type="submit">저장</Button>
      </form>
    </Modal>
  )
}
