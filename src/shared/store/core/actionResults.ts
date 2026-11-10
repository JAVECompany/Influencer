import type { Failure, Success } from '../../types/actionResult'

export const fail = (error: string): Failure => ({ error })

export const ok: Success = { success: true }
