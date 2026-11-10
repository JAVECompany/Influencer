import { useState } from 'react'
import { useAccountStore } from '../../../../shared/store/account/account'
import { useCreatorStore } from '../../../../shared/store/creator/creator'
import type { ICreator } from '../../../../shared/types/account'
import type { IPageProps } from '../../../../shared/types/navigation'

export function useCreatorReview(notify: IPageProps['notify']) {
  const accounts = useAccountStore((s) => s.accounts)
  const creators = useCreatorStore((s) => s.creators)
  const reviewCreatorApplication = useCreatorStore((s) => s.reviewCreatorApplication)
  const [target, setTarget] = useState<ICreator | null>(null)
  const applicants = Object.values(creators)
    .filter((c) => c.method)
    .sort((a, b) => Number(b.status === 'pending') - Number(a.status === 'pending'))
  const closeDialog = () => setTarget(null)
  const approve = (id: string) => notify(reviewCreatorApplication(id, 'approved'), '신청을 승인했어요.')
  const reject = (reason: string) => {
    if (!target) {
      return
    }

    const result = reviewCreatorApplication(target.id, 'rejected', reason)
    notify(result, '신청을 반려했어요.')
    if (!result.error) {
      closeDialog()
    }
  }

  return { accounts: accounts, applicants, target, setTarget, approve, reject, closeDialog }
}
