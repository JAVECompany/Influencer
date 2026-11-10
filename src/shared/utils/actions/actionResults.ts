import type { FailureType, SuccessType } from '../../types/actionResult'

export const fail = (error: string): FailureType => ({ error })

export const ok: SuccessType = { success: true }
