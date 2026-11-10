import type { Content } from '../types/content'

export const byRecent = (a: Content, b: Content) => b.at - a.at
