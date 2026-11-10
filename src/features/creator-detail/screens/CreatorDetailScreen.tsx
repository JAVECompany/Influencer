import { LockKeyhole } from 'lucide-react'
import ContentPreviewDialog from '../../../shared/components/content/ContentPreviewDialog'
import PostCard from '../../../shared/components/content/PostCard'
import StoryRail from '../../../shared/components/content/StoryRail'
import ProductMedia from '../../../shared/components/products/ProductMedia'
import RouletteWheelDialog from '../../../shared/components/roulette/RouletteWheelDialog'
import BackButton from '../../../shared/components/ui/actions/BackButton'
import EmptyState from '../../../shared/components/ui/feedback/EmptyState'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import type { FeedPropsType } from '../../../shared/types/feed'
import CreatorOfferDialog from '../components/CreatorOfferDialog'
import CreatorProfileHeader from '../components/CreatorProfileHeader'
import CreatorShop from '../components/CreatorShop'
import { useCreatorDetail } from '../hooks/useCreatorDetail'

export default function CreatorDetailScreen({
  id,
  account,
  back,
  openCreator,
  openChat,
  notify,
}: FeedPropsType & { id: string; back: () => void }) {
  const detail = useCreatorDetail(id, account, notify)
  if (!detail) {
    return (
      <>
        <BackButton onClick={back} />
        <EmptyState title="프로필을 열 수 없어요" />
      </>
    )
  }

  const {
    creator,
    creatorAccount,
    staff,
    active,
    posts,
    preview,
    previewPost,
    setPreview,
    offer,
    setOffer,
    closeOffer,
    purchases,
    products,
    roulette,
    balance,
    creators,
    accounts,
    subscribers,
    confirmOffer,
    playRoulette,
  } = detail

  return (
    <>
      <BackButton onClick={back} />
      <CreatorProfileHeader
        creator={creator}
        account={creatorAccount}
        active={active}
        staff={staff}
        subscribers={subscribers}
        onSubscribe={() => setOffer({ type: 'subscribe', name: creator.name })}
      />
      {active ? (
        <div className="grid gap-5">
          <CreatorShop
            products={products}
            roulette={roulette}
            purchases={purchases}
            staff={staff}
            onOffer={setOffer}
          />
          {posts.some((p) => p.kind !== 'post') && (
            <StoryRail
              stories={posts.filter((p) => p.kind !== 'post')}
              onOpen={setPreview}
              creators={creators}
              accounts={accounts}
            />
          )}
          <h2 className="font-black">구독자 전용 게시글</h2>
          {posts
            .filter((p) => p.kind === 'post')
            .map((post) => (
              <PostCard key={post.id} {...{ post, account, openCreator, openChat, notify }} />
            ))}
          {!posts.some((p) => p.kind === 'post') && <EmptyState title="아직 게시글이 없어요" />}
        </div>
      ) : (
        <EmptyState
          icon={LockKeyhole}
          title="구독자 전용 콘텐츠"
          description="구독하면 모든 게시글, 스토리, 라이브 미리보기와 크리에이터 상점이 열려요."
        />
      )}
      {preview && (
        <ContentPreviewDialog post={previewPost} account={account} onClose={() => setPreview(null)} />
      )}
      {offer?.type === 'owned' && (
        <Modal title={offer.name} onClose={closeOffer} protectedContent>
          <ProductMedia product={offer} />
        </Modal>
      )}
      {offer?.type === 'roulette' && roulette && active && (
        <RouletteWheelDialog
          roulette={roulette}
          onClose={closeOffer}
          mode={staff ? 'review' : 'customer'}
          balance={balance}
          onPlay={playRoulette}
        />
      )}
      {(offer?.type === 'subscribe' || offer?.type === 'product') && (
        <CreatorOfferDialog
          offer={offer}
          price={creator.price}
          balance={balance}
          onConfirm={confirmOffer}
          onClose={closeOffer}
        />
      )}
    </>
  )
}
