import Button from '../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../shared/components/ui/forms/FieldLabel'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import { field } from '../../../shared/styles/controlStyles'
import type { ProfileChanges } from '../../../shared/types/account'
import type { Notify } from '../../../shared/types/actionResult'

export default function ChangePasswordDialog({
  save,
  notify,
  onClose,
}: {
  save: (changes: ProfileChanges, message: string) => void
  notify: Notify
  onClose: () => void
}) {
  return (
    <Modal title="비밀번호 변경" onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          if (data.get('next') !== data.get('confirm'))
            return notify({ error: '새 비밀번호 확인이 일치하지 않아요.' })
          save(
            { current: String(data.get('current') ?? ''), password: String(data.get('next') ?? '') },
            '비밀번호를 변경했어요.'
          )
        }}
      >
        <FieldLabel title="현재 비밀번호">
          <input name="current" type="password" required autoComplete="current-password" className={field} />
        </FieldLabel>
        <FieldLabel title="새 비밀번호">
          <input
            name="next"
            type="password"
            required
            minLength={6}
            maxLength={72}
            autoComplete="new-password"
            className={field}
          />
        </FieldLabel>
        <FieldLabel title="새 비밀번호 확인">
          <input name="confirm" type="password" required autoComplete="new-password" className={field} />
        </FieldLabel>
        <Button type="submit">변경</Button>
      </form>
    </Modal>
  )
}
