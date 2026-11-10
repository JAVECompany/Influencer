import { useState } from 'react'
import Button from '../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../shared/components/ui/forms/FieldLabel'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import { field } from '../../../shared/styles/controlStyles'
import type { Account, ProfileChanges } from '../../../shared/types/account'
import type { Notify } from '../../../shared/types/actionResult'
import { readMediaFile } from '../../../shared/utils/media/readMediaFile'

export default function EditProfileDialog({
  account,
  save,
  notify,
  onClose,
}: {
  account: Account
  save: (changes: ProfileChanges, message: string) => void
  notify: Notify
  onClose: () => void
}) {
  const [name, setName] = useState(account.name)
  return (
    <Modal title="프로필 수정" onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault()
          const file = new FormData(event.currentTarget).get('avatar')
          try {
            const avatar = file instanceof File && file.size ? await readMediaFile(file) : account.avatar
            save({ name, avatar }, '프로필을 저장했어요.')
          } catch (error) {
            notify({ error: error instanceof Error ? error.message : '이미지를 읽을 수 없습니다.' })
          }
        }}
      >
        <FieldLabel title="닉네임">
          <input
            required
            maxLength={20}
            className={field}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FieldLabel>
        <FieldLabel title="프로필 이미지 (280 KB 이하)">
          <input name="avatar" type="file" accept="image/png,image/jpeg,image/webp" className={field} />
        </FieldLabel>
        <Button type="submit">저장</Button>
      </form>
    </Modal>
  )
}
