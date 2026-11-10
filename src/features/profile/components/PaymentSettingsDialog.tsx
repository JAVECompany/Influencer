import { useState } from 'react'
import Button from '../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../shared/components/ui/forms/FieldLabel'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import { field } from '../../../shared/styles/controlStyles'
import type { Account, ProfileChanges } from '../../../shared/types/account'

export default function PaymentSettingsDialog({
  account,
  save,
  onClose,
}: {
  account: Account
  save: (changes: ProfileChanges, message: string) => void
  onClose: () => void
}) {
  const [payment, setPayment] = useState(account.payment)
  return (
    <Modal title="데모 결제·정산 수단" onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          save({ payment }, '수단을 저장했어요.')
        }}
      >
        <p className="text-sm text-muted">가상의 계좌 또는 결제수단을 선택하세요.</p>
        <FieldLabel title="데모 수단">
          <select className={field} value={payment} onChange={(event) => setPayment(event.target.value)}>
            <option value="">미등록</option>
            <option value="가상 국내 계좌">가상 국내 계좌</option>
            {account.role === 'customer' ? (
              <option value="가상 카드">가상 카드</option>
            ) : (
              <option value="가상 미국 수취 계좌">가상 미국 수취 계좌</option>
            )}
          </select>
        </FieldLabel>
        <Button type="submit">저장</Button>
      </form>
    </Modal>
  )
}
