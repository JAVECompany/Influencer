import { ArrowRight, Compass } from 'lucide-react'
import ContentPreviewDialog from '../../../shared/components/content/ContentPreviewDialog'
import PostCard from '../../../shared/components/content/PostCard'
import StoryRail from '../../../shared/components/content/StoryRail'
import Button from '../../../shared/components/ui/actions/Button'
import EmptyState from '../../../shared/components/ui/feedback/EmptyState'
import PageTitle from '../../../shared/components/ui/layout/PageTitle'
import type { FeedProps } from '../../../shared/types/feed'
import type { PageProps } from '../../../shared/types/navigation'
import FeedReviewFilter from '../components/FeedReviewFilter'
import FeedSidebar from '../components/FeedSidebar'
import { useHomeFeed } from '../hooks/useHomeFeed'

export default function HomeScreen({
  account,
  openCreator,
  openChat,
  go,
  notify,
}: FeedProps & Pick<PageProps, 'go'>) {
  const {
    accounts,
    creators,
    previewPost,
    preview,
    setPreview,
    owner,
    changeOwner,
    limit,
    loadMore,
    staff,
    feed,
    stories,
    spotlight,
    reviewCreators,
  } = useHomeFeed(account)
  return (
    <>
      <PageTitle
        title={staff ? '전체 크리에이터 피드' : '나의 피드'}
        subtitle={
          staff
            ? '고객 홈 형식으로 게시글·스토리·라이브를 검수합니다. 검수 열람은 조회수·참여자 명단·구독자 수·매출에 반영되지 않습니다.'
            : '구독 중인 크리에이터의 새로운 이야기를 만나보세요.'
        }
      />
      {staff && (
        <FeedReviewFilter
          owner={owner}
          creators={reviewCreators}
          onOwnerChange={changeOwner}
          openCreator={openCreator}
        />
      )}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_265px]">
        <div className="min-w-0">
          <StoryRail stories={stories} onOpen={setPreview} creators={creators} accounts={accounts} />
          <h2 className="mb-3 flex items-center justify-between text-sm font-black">
            최근 게시글 <span className="text-[11px] font-medium tracking-wide text-muted">최신순</span>
          </h2>
          <div className="grid gap-5">
            {feed.slice(0, limit).map((post) => (
              <PostCard key={post.id} {...{ post, account, openCreator, openChat, notify }} />
            ))}
            {limit < feed.length && (
              <Button tone="subtle" onClick={loadMore}>
                게시글 더 보기 · {limit}/{feed.length}
              </Button>
            )}
            {!feed.length && (
              <EmptyState
                icon={Compass}
                title="아직 피드가 비어 있어요"
                description={
                  staff
                    ? '선택한 크리에이터의 게시글이 없어요.'
                    : '관심 있는 크리에이터를 구독하면 새 게시글이 여기에 표시돼요.'
                }
              >
                {!staff && (
                  <Button onClick={() => go('search')}>
                    크리에이터 찾기 <ArrowRight size={16} />
                  </Button>
                )}
              </EmptyState>
            )}
          </div>
        </div>
        <FeedSidebar
          staff={staff}
          spotlight={spotlight}
          accounts={accounts}
          openCreator={openCreator}
          go={go}
        />
      </div>
      {preview && (
        <ContentPreviewDialog post={previewPost} account={account} onClose={() => setPreview(null)} />
      )}
    </>
  )
}
