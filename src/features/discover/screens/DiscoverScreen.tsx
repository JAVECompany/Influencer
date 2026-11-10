import { Compass, Search } from 'lucide-react'
import EmptyState from '../../../shared/components/ui/EmptyState'
import PageTitle from '../../../shared/components/ui/PageTitle'
import { panel } from '../../../shared/styles/controlStyles'
import type { PageProps } from '../../../shared/types/navigation'
import CreatorBubble from '../components/CreatorBubble'
import CreatorGlobe from '../components/CreatorGlobe'
import { useDiscoverCreators } from '../hooks/useDiscoverCreators'
import { circleSize } from '../utils/globeLayout'

export default function DiscoverScreen({ account, openCreator }: Pick<PageProps, 'account' | 'openCreator'>) {
  const { query, setQuery, term, items, matches, peak } = useDiscoverCreators(account)
  return (
    <>
      <PageTitle
        label="DISCOVER"
        title="크리에이터 탐색"
        subtitle="중앙에는 내 구독, 주변에는 새로운 크리에이터가 표시됩니다."
      />
      <label className={`${panel} mb-5 flex items-center gap-3 px-4`}>
        <Search size={19} className="text-dim" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="닉네임 또는 핸들 검색"
          placeholder="닉네임 또는 @핸들 검색"
          className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-dim"
        />
      </label>
      {!matches.length ? (
        <EmptyState
          icon={Compass}
          title="검색 결과가 없어요"
          description="다른 닉네임이나 핸들로 검색해 보세요."
        />
      ) : term ? (
        <div className={`${panel} flex flex-wrap items-center justify-center gap-4 p-5`}>
          {matches.map((item) => (
            <CreatorBubble
              key={item.creator.id}
              item={item}
              size={circleSize(item.count, peak, true)}
              style={{ width: 91 }}
              onClick={() => openCreator(item.creator.id)}
            />
          ))}
        </div>
      ) : (
        <CreatorGlobe items={items} peak={peak} openCreator={openCreator} />
      )}
    </>
  )
}
