import type { IContent } from '../../types/content'

export const compareByNewest = (a: IContent, b: IContent) => b.at - a.at
