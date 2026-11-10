import type { Failure } from '../../types/actionResult'
import type { Content, PublishInput } from '../../types/content'
import { fail } from '../actions/actionResults'

export function prepareContent(
  { title, body, kind, media = '' }: PublishInput,
  owner: string,
  art: number
): Content | Failure {
  if (!title.trim() || !body.trim() || !['post', 'story', 'live'].includes(kind))
    return fail('콘텐츠 제목과 내용을 입력해 주세요.')
  if (media && (media.length > 400_000 || !/^data:image\/(png|jpeg|webp);base64,/.test(media)))
    return fail('지원하는 이미지 파일을 선택해 주세요.')

  return {
    id: crypto.randomUUID(),
    owner,
    kind,
    title: title.trim().slice(0, 80),
    body: body.trim().slice(0, 500),
    media,
    at: Date.now(),
    art,
    likes: [],
    reports: [],
    hidden: false,
  }
}
