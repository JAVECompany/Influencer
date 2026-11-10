import Button from '../../../../shared/components/ui/Button'
import FieldLabel from '../../../../shared/components/ui/FieldLabel'
import Modal from '../../../../shared/components/ui/Modal'
import { field } from '../../../../shared/styles/controlStyles'
import type { Creator } from '../../../../shared/types/account'
import { readFormValue } from '../../../../shared/utils/formData'

export default function RejectApplicationDialog({
  creator,
  onReject,
  onClose,
}: {
  creator: Creator
  onReject: (reason: string) => void
  onClose: () => void
}) {
  return (
    <Modal title={creator.name + ' 신청 반려'} onClose={onClose}>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          onReject(readFormValue(new FormData(event.currentTarget), 'reason'))
        }}
      >
        <FieldLabel title="신청자에게 표시할 사유">
          <textarea name="reason" required maxLength={180} className={field} rows={3} />
        </FieldLabel>
        <Button type="submit" tone="danger">
          반려 확정
        </Button>
      </form>
    </Modal>
  )
}
