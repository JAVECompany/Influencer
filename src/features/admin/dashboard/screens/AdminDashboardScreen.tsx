import { ClipboardList, Shield, UserRoundCheck } from 'lucide-react'
import Button from '../../../../shared/components/ui/actions/Button'
import PageTitle from '../../../../shared/components/ui/layout/PageTitle'
import StatCard from '../../../../shared/components/ui/display/StatCard'
import { isPublic } from '../../../../shared/utils/creator/creatorAccess'
import { useAccountStore } from '../../../../shared/store/account/account'
import { useContentStore } from '../../../../shared/store/content/content'
import { useCreatorStore } from '../../../../shared/store/creator/creator'
import { panel } from '../../../../shared/styles/controlStyles'
import type { IPageProps } from '../../../../shared/types/navigation'

export default function AdminDashboardScreen({ go }: Pick<IPageProps, 'go'>) {
  const accounts = useAccountStore((s) => s.accounts)
  const creators = useCreatorStore((s) => s.creators)
  const posts = useContentStore((s) => s.posts)
  const pending = Object.values(creators).filter((c) => c.status === 'pending').length
  const reported = posts.filter((p) => p.reports.length > 0 && !p.hidden).length
  return (
    <>
      <PageTitle title="운영 개요" />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="검토 대기" value={pending + '건'} icon={ClipboardList} />
        <StatCard
          label="공개 크리에이터"
          value={Object.keys(creators).filter((id) => isPublic({ accounts, creators }, id)).length + '명'}
          icon={UserRoundCheck}
        />
        <StatCard label="공개 신고 콘텐츠" value={reported + '건'} icon={Shield} />
      </div>
      <section className={`${panel} mt-5 p-5`}>
        <h2 className="font-black">오늘의 운영</h2>
        <p className="mt-2 text-sm text-muted">심사 요청과 고객 신고를 확인하세요.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => go('review')}>심사 요청 보기</Button>
          <Button tone="subtle" onClick={() => go('home')}>
            전체 피드 보기
          </Button>
          <Button tone="subtle" onClick={() => go('moderate')}>
            콘텐츠 관리
          </Button>
        </div>
      </section>
    </>
  )
}
