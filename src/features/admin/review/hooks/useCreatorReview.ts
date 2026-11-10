import { useState } from 'react'
import { useAppStore } from '../../../../shared/store/useAppStore'
import type { Creator } from '../../../../shared/types/account'
import type { PageProps } from '../../../../shared/types/navigation'

export function useCreatorReview(notify: PageProps['notify']) {
  const state = useAppStore()
  const [target, setTarget] = useState<Creator | null>(null)
  const applicants = Object.values(state.creators)
    .filter((c) => c.method)
    .sort((a, b) => Number(b.status === 'pending') - Number(a.status === 'pending'))
  const closeDialog = () => setTarget(null)
  const approve = (id: string) => notify(state.review(id, 'approved'), '신청을 승인했어요.')
  const reject = (reason: string) => {
    if (!target) return
    const result = state.review(target.id, 'rejected', reason)
    notify(result, '신청을 반려했어요.')
    if (!result.error) closeDialog()
  }

  return { accounts: state.accounts, applicants, target, setTarget, approve, reject, closeDialog }
}
