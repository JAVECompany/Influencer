import type { PageProps } from './navigation'

export type FeedProps = Pick<PageProps, 'account' | 'openCreator' | 'openChat' | 'notify'>
