import type { FormEventHandler } from 'react'
import Button from '../../../shared/components/ui/Button'
import FieldLabel from '../../../shared/components/ui/FieldLabel'
import { field, panel } from '../../../shared/styles/controlStyles'
import type { ApplicationMethod, Creator } from '../../../shared/types/account'

export default function CreatorApplicationForm({
  creator,
  accountName,
  method,
  onMethodChange,
  onSubmit,
}: {
  creator?: Creator
  accountName: string
  method: ApplicationMethod
  onMethodChange: (method: ApplicationMethod) => void
  onSubmit: FormEventHandler<HTMLFormElement>
}) {
  return (
    <form className={`${panel} grid gap-4 p-5 sm:p-6`} onSubmit={onSubmit}>
      <div className="flex flex-wrap gap-2">
        <Button
          aria-pressed={method === 'link'}
          tone={method === 'link' ? 'primary' : 'subtle'}
          onClick={() => onMethodChange('link')}
        >
          Instagram 링크
        </Button>
        <Button
          aria-pressed={method === 'direct'}
          tone={method === 'direct' ? 'primary' : 'subtle'}
          onClick={() => onMethodChange('direct')}
        >
          직접 입력
        </Button>
      </div>
      {method === 'link' ? (
        <FieldLabel title="Instagram 프로필 링크">
          <input
            type="url"
            name="instagram"
            required
            className={field}
            placeholder="https://www.instagram.com/handle"
            defaultValue={creator?.instagram}
          />
        </FieldLabel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel title="표시 이름">
            <input
              name="name"
              required
              maxLength={20}
              className={field}
              defaultValue={creator?.name || accountName}
            />
          </FieldLabel>
          <FieldLabel title="Instagram 핸들">
            <input name="handle" required maxLength={30} className={field} defaultValue={creator?.handle} />
          </FieldLabel>
          <FieldLabel title="연락 이메일">
            <input
              type="email"
              name="email"
              required
              maxLength={100}
              className={field}
              defaultValue={creator?.email}
            />
          </FieldLabel>
          <FieldLabel title="소개">
            <input name="bio" required maxLength={240} className={field} defaultValue={creator?.bio} />
          </FieldLabel>
        </div>
      )}
      <p className="text-xs text-dim">
        데모에는 Instagram 비밀번호, 주민등록번호, 계좌번호를 입력하지 마세요.
      </p>
      <Button type="submit" className="justify-self-start">
        입점 심사 요청
      </Button>
    </form>
  )
}
