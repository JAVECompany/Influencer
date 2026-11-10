export type Failure = { error: string }

export type Success = { success: true; error?: never }

export type ActionResult = Success | Failure

export type SpendResult =
  | (Success & { reward: string; rewardIndex?: number })
  | (Failure & { reward?: never; rewardIndex?: never })

export type Notify = (result: { error?: string }, success?: string) => void
