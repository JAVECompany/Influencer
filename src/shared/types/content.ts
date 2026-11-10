export type ContentKindType = 'post' | 'story' | 'live'

export interface IContent {
  id: string
  owner: string
  kind: ContentKindType
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

export type PublishInputType = Pick<IContent, 'title' | 'body' | 'kind' | 'media'>

export type PostActionType = 'remove' | 'hide' | 'like' | 'report'
