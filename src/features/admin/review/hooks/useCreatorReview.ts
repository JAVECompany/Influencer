import { useState } from 'react'
import { useAccountStore } from '../../../../shared/store/account/account'
import { useCreatorStore } from '../../../../shared/store/creator/creator'
import type { Creator } from '../../../../shared/types/account'
import type { PageProps } from '../../../../shared/types/navigation'

export function useCreatorReview(notify: PageProps['notify']) {
  const accounts = useAccountStore((state) => state.accounts)
  const creators = useCreatorStore((state) => state.creators)
  const review = useCreatorStore((state) => state.review)
  const [target, setTarget] = useState<Creator | null>(null)
  const applicants = Object.values(creators)
    .filter((c) => c.method)
    .sort((a, b) => Number(b.status === 'pending') - Number(a.status === 'pending'))
  const closeDialog = () => setTarget(null)
  const approve = (id: string) => notify(review(id, 'approved'), '신청을 승인했어요.')
  const reject = (reason: string) => {
    if (!target) {
      return
    }

    const result = review(target.id, 'rejected', reason)
    notify(result, '신청을 반려했어요.')
    if (!result.error) {
      closeDialog()
    }
  }

  return { accounts: accounts, applicants, target, setTarget, approve, reject, closeDialog }
}
