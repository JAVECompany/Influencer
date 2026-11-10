import Badge from '../../../shared/components/ui/display/Badge'
import PageTitle from '../../../shared/components/ui/layout/PageTitle'
import { creatorReviewStatus } from '../../../shared/constants/creatorReviewStatus'
import { panel } from '../../../shared/styles/controlStyles'
import type { OperatorProps } from '../../../shared/types/navigation'
import CreatorApplicationForm from '../components/CreatorApplicationForm'
import { useCreatorApplication } from '../hooks/useCreatorApplication'

export default function CreatorApplicationScreen({ account, notify }: OperatorProps) {
  const { creator, method, setMethod, submit } = useCreatorApplication({ account, notify })
  return (
    <>
      <PageTitle
        title="크리에이터 입점"
        subtitle="Instagram 계정을 연결하거나 기본 정보를 직접 입력하세요."
      />
      {creator && (
        <div className={`${panel} mb-5 p-5`}>
          <Badge>{creatorReviewStatus[creator.status]}</Badge>
          <p className="mt-3 text-sm break-words text-muted">
            {creator.reason || '운영팀이 신청 내용을 확인하고 있어요. 승인 후 스튜디오를 이용할 수 있습니다.'}
          </p>
        </div>
      )}
      {creator?.status !== 'pending' && (
        <CreatorApplicationForm
          creator={creator}
          accountName={account.name}
          method={method}
          onMethodChange={setMethod}
          onSubmit={submit}
        />
      )}
    </>
  )
}
