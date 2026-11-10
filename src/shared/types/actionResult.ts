export type FailureType = { error: string }

export type SuccessType = { success: true; error?: never }

export type ActionResultType = SuccessType | FailureType

export type SpendResultType =
  | (SuccessType & { reward: string; rewardIndex?: number })
  | (FailureType & { reward?: never; rewardIndex?: never })

export type NotifyType = (result: { error?: string }, success?: string) => void
