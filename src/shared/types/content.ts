export type ContentKind = 'post' | 'story' | 'live'

export interface Content {
  id: string
  owner: string
  kind: ContentKind
  title: string
  body: string
  art: number
  at: number
  media?: string
  hidden: boolean
  likes: string[]
  reports: string[]
  viewers?: string[]
}

export type PublishInput = Pick<Content, 'title' | 'body' | 'kind' | 'media'>

export type PostAction = 'remove' | 'hide' | 'like' | 'report'
