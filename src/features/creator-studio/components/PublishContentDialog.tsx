import { useState } from 'react'
import Button from '../../../shared/components/ui/Button'
import FieldLabel from '../../../shared/components/ui/FieldLabel'
import Modal from '../../../shared/components/ui/Modal'
import { field } from '../../../shared/styles/controlStyles'
import type { Notify } from '../../../shared/types/actionResult'
import type { ContentKind, PublishInput } from '../../../shared/types/content'
import { readFormValue } from '../../../shared/utils/formData'
import { readMediaFile } from '../../../shared/utils/readMediaFile'

export default function PublishContentDialog({
  onPublish,
  notify,
  onClose,
}: {
  onPublish: (input: PublishInput) => void
  notify: Notify
  onClose: () => void
}) {
  const [kind, setKind] = useState<ContentKind>('post')
  return (
    <Modal title="콘텐츠 등록" onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          const file = data.get('media')
          try {
            const media = file instanceof File && file.size ? await readMediaFile(file) : ''
            onPublish({ title: readFormValue(data, 'title'), body: readFormValue(data, 'body'), kind, media })
          } catch (error) {
            notify({ error: error instanceof Error ? error.message : '파일을 읽을 수 없습니다.' })
          }
        }}
      >
        <FieldLabel title="유형">
          <select
            className={field}
            value={kind}
            onChange={(event) => {
              const next = event.target.value
              if (next === 'post' || next === 'story' || next === 'live') setKind(next)
            }}
          >
            <option value="post">게시글</option>
            <option value="story">스토리 · 24시간</option>
            <option value="live">라이브 미리보기</option>
          </select>
        </FieldLabel>
        <FieldLabel title="제목">
          <input name="title" required maxLength={80} className={field} />
        </FieldLabel>
        <FieldLabel title="내용">
          <textarea name="body" required maxLength={500} rows={3} className={field} />
        </FieldLabel>
        <FieldLabel title="이미지 (선택 · 280 KB 이하)">
          <input name="media" type="file" accept="image/png,image/jpeg,image/webp" className={field} />
        </FieldLabel>
        {kind === 'live' && <p className="text-xs text-dim">구독자 홈에 편성 미리보기가 표시됩니다.</p>}
        <Button type="submit">구독자에게 공개</Button>
      </form>
    </Modal>
  )
}
