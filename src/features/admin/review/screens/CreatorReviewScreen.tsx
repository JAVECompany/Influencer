import { BadgeCheck } from 'lucide-react'
import EmptyState from '../../../../shared/components/ui/feedback/EmptyState'
import PageTitle from '../../../../shared/components/ui/layout/PageTitle'
import type { PageProps } from '../../../../shared/types/navigation'
import CreatorReviewCard from '../components/CreatorReviewCard'
import RejectApplicationDialog from '../components/RejectApplicationDialog'
import { useCreatorReview } from '../hooks/useCreatorReview'

export default function CreatorReviewScreen({ notify }: Pick<PageProps, 'notify'>) {
  const { accounts, applicants, target, setTarget, approve, reject, closeDialog } = useCreatorReview(notify)
  return (
    <>
      <PageTitle
        title="심사 요청 목록"
        subtitle="크리에이터의 신청 정보를 확인한 뒤 검색 공개 여부를 결정하세요."
      />
      {!applicants.length ? (
        <EmptyState
          icon={BadgeCheck}
          title="아직 접수된 심사 요청이 없어요"
          description="크리에이터가 심사를 요청하면 이곳에 표시됩니다."
        />
      ) : (
        <div className="grid gap-3">
          {applicants.map((creator) => (
            <CreatorReviewCard
              key={creator.id}
              creator={creator}
              account={accounts[creator.id]}
              onApprove={approve}
              onReject={setTarget}
            />
          ))}
        </div>
      )}
      {target && <RejectApplicationDialog creator={target} onReject={reject} onClose={closeDialog} />}
    </>
  )
}
