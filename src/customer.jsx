import { useState } from 'react'
import { ArrowRight, Coins, Compass, Flag, Heart, LockKeyhole, MessageCircle, Radio, ShieldCheck, ShoppingBag, Sparkles, UsersRound } from 'lucide-react'
import { kindNames, krw, number, packs, relativeTime } from './data'
import { canRead, hasSubscription, isPublic, subscriberCount, useApp } from './store'
import { Avatar, Back, Badge, Button, Empty, field, Modal, PageTitle, panel, Protected, Scene } from './ui'
import { Ledger } from './shared'
import { ProductMedia, ProductThumbnail } from './product-media'

const byRecent = (a, b) => b.at - a.at
const visibleStory = (post) => post.kind !== 'story' || Date.now() - post.at < 86_400_000
const iconAction = 'grid size-10 place-items-center rounded-xl text-dim transition hover:bg-white/5 hover:text-white'

function ContentMedia({ post }) {
  return post.media
    ? <img src={post.media} alt={post.title} draggable={false} className="aspect-video w-full object-cover" />
    : <Scene art={post.art} className="aspect-video w-full" />
}

export function ContentPreview({ post, account, onClose }) {
  const state = useApp()
  if (!canRead(state, post) || (account.role === 'customer' && !visibleStory(post))) return null
  return <Modal title={post.title} onClose={onClose}>
    <Protected viewer={account.id} className="rounded-xl">
      <ContentMedia post={post} />
      <div className="bg-night p-4"><Badge live={post.kind === 'live'}>{kindNames[post.kind]} 미리보기</Badge><p className="mt-2 text-sm leading-relaxed text-dim">{post.body}</p></div>
    </Protected>
    {post.kind === 'live' && <p className="mt-3 text-xs text-dim">라이브 편성 미리보기 · 데모</p>}
  </Modal>
}

function PostCard({ post, account, openCreator, openChat, notify }) {
  const state = useApp()
  const creator = state.creators[post.owner]
  if (!creator || !canRead(state, post)) return null
  const staff = account.role === 'admin'
  const liked = post.likes.includes(account.id)
  const reported = post.reports.includes(account.id)
  return <article className={`${panel} overflow-hidden`}>
    <header className="flex items-center justify-between gap-2 px-4 py-3.5">
      <button onClick={() => openCreator(creator.id)} className="flex min-w-0 items-center gap-3 text-left">
        <Avatar person={creator} account={state.accounts[creator.id]} className="size-10" />
        <span className="min-w-0"><span className="block truncate text-sm font-black">{creator.name}</span><span className="text-xs text-dim">@{creator.handle} · {relativeTime(post.at)}</span></span>
      </button>
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#1b3036] px-3 py-1.5 text-[10px] font-bold text-mint"><LockKeyhole size={12} />{staff ? (post.hidden ? '숨김 · 검수 중' : '관리자 검수') : '구독자 전용'}</span>
    </header>
    <Protected viewer={account.id}>
      <ContentMedia post={post} />
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[17px] font-black">{post.title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed break-words text-dim">{post.body}</p>
      </div>
    </Protected>
    {staff ? <footer className="flex items-center justify-between gap-2 px-4 py-2">
      <span className="text-xs text-dim">신고 {post.reports.length}건</span>
      <Button tone="subtle" onClick={() => notify(state.managePost(post.id, 'hide'), post.hidden ? '콘텐츠를 다시 공개했어요.' : '콘텐츠를 숨겼어요.')}>{post.hidden ? '다시 공개' : '숨김'}</Button>
    </footer> : <footer className="flex items-center gap-1 px-3 py-2">
      <button type="button" aria-label="좋아요" aria-pressed={liked} className={iconAction} onClick={() => state.managePost(post.id, 'like')}><Heart size={20} fill={liked ? '#ee7a9f' : 'none'} color={liked ? '#ee7a9f' : 'currentColor'} /></button>
      {post.likes.length > 0 && <span className="text-xs text-dim">{post.likes.length}</span>}
      <button type="button" aria-label="채팅" className={iconAction} onClick={() => openChat(creator.id)}><MessageCircle size={19} /></button>
      <button type="button" aria-label={reported ? '신고 완료' : '게시글 신고'} disabled={reported} className={`ml-auto ${iconAction}`} onClick={() => notify(state.managePost(post.id, 'report'), '운영팀 검토 목록에 등록했어요.')}><Flag size={17} /></button>
    </footer>}
  </article>
}

function StoryRail({ stories, onOpen, creators, accounts }) {
  return <section className="mb-7" aria-labelledby="stories-heading">
    <h2 id="stories-heading" className="mb-3 flex items-center gap-2 text-sm font-black"><Radio size={17} className="text-mint" /> 라이브 · 스토리</h2>
    {stories.length === 0 ? <p className={`${panel} p-4 text-sm text-dim`}>현재 열 수 있는 스토리와 라이브가 없어요.</p> :
      <div className={`${panel} flex gap-4 overflow-x-auto px-4 py-4 sm:gap-6 sm:px-5`}>
        {stories.map((post) => {
          const creator = creators[post.owner]
          return <button type="button" key={post.id} aria-label={creator.name + ' ' + kindNames[post.kind]} onClick={() => onOpen(post.id)}
            className="group grid w-[69px] shrink-0 justify-items-center gap-2.5">
            <span className={`relative grid size-[66px] place-items-center rounded-full p-0.5 transition group-hover:scale-105 ${post.kind === 'live' ? 'bg-linear-to-tr from-[#ec486d] to-[#ffba94]' : 'bg-linear-to-tr from-[#5597fa] to-mint'}`}>
              <Avatar person={creator} account={accounts[creator.id]} className="size-[60px] border-[3px] border-night" />
              {post.kind === 'live' && <span className="absolute -bottom-1 rounded-md border-2 border-panel bg-[#e73765] px-1.5 py-px text-[9px] font-black">LIVE</span>}
            </span>
            <span className="w-full truncate text-xs font-semibold">{creator.name}</span>
          </button>
        })}
      </div>}
  </section>
}

export function Home({ account, openCreator, openChat, go, notify }) {
  const state = useApp()
  const [preview, setPreview] = useState(null)
  const [owner, setOwner] = useState('')
  const [limit, setLimit] = useState(8)
  const staff = account.role === 'admin'
  const readable = state.posts.filter((p) => state.creators[p.owner] && (!owner || p.owner === owner) && canRead(state, p))
  const feed = readable.filter((p) => p.kind === 'post').sort(byRecent)
  const stories = readable.filter((p) => p.kind !== 'post' && (staff || visibleStory(p)))
    .sort((a, b) => Number(b.kind === 'live') - Number(a.kind === 'live') || byRecent(a, b))
  const spotlight = Object.values(state.creators).filter((c) => isPublic(state, c.id) && !hasSubscription(state, account.id, c.id))
    .sort((a, b) => b.fans - a.fans).slice(0, 4)
  const reviewCreators = staff ? Object.values(state.creators).filter((c) => c.status === 'approved').sort((a, b) => a.name.localeCompare(b.name, 'ko')) : []
  return <>
    <PageTitle label={staff ? 'CONTENT REVIEW' : 'YOUR ORBIT'} title={staff ? '전체 크리에이터 피드' : '나의 피드'}
      subtitle={staff ? '고객 홈 형식으로 게시글·스토리·라이브를 검수합니다. 이 열람은 구독자 수나 매출에 반영되지 않습니다.' : '구독 중인 크리에이터의 새로운 이야기를 만나보세요.'} />
    {staff && <div className={`${panel} mb-5 flex flex-wrap items-end gap-2 p-3`}>
      <label className="min-w-40 flex-1 text-xs font-bold text-dim">검수할 크리에이터
        <select className={`${field} mt-1`} value={owner} onChange={(event) => { setOwner(event.target.value); setLimit(8) }}>
          <option value="">모든 크리에이터</option>
          {reviewCreators.map((c) => <option key={c.id} value={c.id}>{c.name} · @{c.handle}</option>)}
        </select>
      </label>
      <Button tone="subtle" disabled={!owner} onClick={() => openCreator(owner)}>프로필·상품 검수</Button>
    </div>}
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_265px]">
      <div className="min-w-0">
        <StoryRail stories={stories} onOpen={setPreview} creators={state.creators} accounts={state.accounts} />
        <h2 className="mb-3 flex items-center justify-between text-sm font-black">최근 게시글 <span className="text-[11px] font-medium tracking-wide text-dim">최신순</span></h2>
        <div className="grid gap-5">
          {feed.slice(0, limit).map((post) => <PostCard key={post.id} {...{ post, account, openCreator, openChat, notify }} />)}
          {limit < feed.length && <Button tone="subtle" onClick={() => setLimit(limit + 8)}>게시글 더 보기 · {limit}/{feed.length}</Button>}
          {!feed.length && <Empty icon={Compass} title="아직 피드가 비어 있어요" description={staff ? '선택한 크리에이터의 게시글이 없어요.' : '관심 있는 크리에이터를 구독하면 새 게시글이 여기에 표시돼요.'}>{!staff && <Button onClick={() => go('search')}>크리에이터 찾기 <ArrowRight size={16} /></Button>}</Empty>}
        </div>
      </div>
      <aside className="hidden gap-4 xl:grid">
        {!staff && <section className={`${panel} p-4`}>
          <div className="mb-4 flex items-center gap-2"><Sparkles size={16} className="text-mint" /><h2 className="text-sm font-black">새로운 크리에이터</h2></div>
          {spotlight.map((c) => <button type="button" key={c.id} onClick={() => openCreator(c.id)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5">
            <Avatar person={c} account={state.accounts[c.id]} className="size-9" />
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{c.name}</span><span className="block truncate text-xs text-dim">@{c.handle}</span></span>
            <ArrowRight size={15} className="text-dim" />
          </button>)}
          <Button tone="plain" className="mt-2 w-full justify-between" onClick={() => go('search')}>전체 탐색 <ArrowRight size={16} /></Button>
        </section>}
        <div className="flex items-start gap-3 px-2 py-3 text-xs leading-relaxed text-dim"><ShieldCheck size={17} className="shrink-0 text-mint" /><span>구독 전용 콘텐츠에는 이용자별 워터마크가 표시됩니다.</span></div>
      </aside>
    </div>
    {preview && <ContentPreview post={state.posts.find((p) => p.id === preview)} account={account} onClose={() => setPreview(null)} />}
  </>
}

export function CreatorDetail({ id, account, back, openCreator, openChat, notify }) {
  const state = useApp()
  const [preview, setPreview] = useState(null)
  const [offer, setOffer] = useState(null)
  const creator = state.creators[id]
  const staff = account.role === 'admin'
  if (!creator || (!staff && !isPublic(state, id))) return <><Back onClick={back} /><Empty title="프로필을 열 수 없어요" /></>
  const active = staff || hasSubscription(state, account.id, id)
  const posts = state.posts.filter((p) => p.owner === id && canRead(state, p) && (staff || visibleStory(p))).sort(byRecent)
  const purchases = new Set(state.transactions.filter((t) => t.customer === account.id && t.type === 'product').map((t) => t.productId))
  const products = state.products.filter((p) => p.owner === id && (staff || !p.archived || purchases.has(p.id)))
  const roulette = state.roulettes[id]
  return <>
    <Back onClick={back} />
    <header className={`${panel} mb-6 overflow-hidden`}>
      <div className="h-24 bg-[radial-gradient(ellipse_at_top_right,#355d66,transparent_75%),linear-gradient(100deg,#182533,#101a2d)] sm:h-32" />
      <div className="px-5 pb-5 sm:px-7">
        <div className="-mt-9 mb-3 flex items-end justify-between gap-2">
          <Avatar person={creator} account={state.accounts[id]} className="size-[76px] border-4 border-panel" />
          {active ? <Badge>{staff ? '관리자 검수' : '구독 중'}</Badge> : <Button onClick={() => setOffer({ type: 'subscribe', name: creator.name })}>{krw(creator.price)} / 월 구독</Button>}
        </div>
        <h1 className="text-2xl font-black">{creator.name}</h1>
        <p className="mt-1 text-sm text-dim">@{creator.handle}</p>
        <p className="mt-3 text-sm break-words">{creator.bio}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-dim"><UsersRound size={14} />구독자 {number(subscriberCount(state, id))}명</p>
      </div>
    </header>
    {active ? <div className="grid gap-5">
      {(products.length > 0 || roulette) && <section className={`${panel} p-5`}>
        <h2 className="mb-3 flex items-center gap-2 font-black"><ShoppingBag size={18} className="text-mint" /> 크리에이터 상점</h2>
        <div className="grid gap-2">
          {products.map((p) => {
            const bought = purchases.has(p.id)
            return <div key={p.id} className="grid items-center gap-3 rounded-xl bg-night p-3 sm:grid-cols-[100px_minmax(0,1fr)_auto]">
              <ProductThumbnail product={p} className="aspect-video w-full sm:w-[100px]" />
              <div className="min-w-0"><p className="text-sm font-bold break-words">{p.name}</p><p className="mt-1 text-xs break-words text-dim">{p.detail}</p></div>
              <Button tone="subtle" className="justify-self-start sm:justify-self-end" onClick={() => setOffer({ ...p, type: staff || bought ? 'owned' : 'product' })}>{staff ? '원본 검수' : bought ? '구매 콘텐츠 열기' : number(p.cost) + ' 코인'}</Button>
            </div>
          })}
          {roulette && <div className="flex items-center justify-between gap-3 rounded-xl bg-night p-3">
            <div><p className="text-sm font-bold">크리에이터 룰렛</p><p className="mt-1 text-xs text-dim">확률을 확인한 후 참여할 수 있어요.</p></div>
            <Button tone="subtle" className="shrink-0" onClick={() => setOffer({ ...roulette, type: staff ? 'review-roulette' : 'roulette', name: '크리에이터 룰렛' })}>{staff ? '확률 검수' : number(roulette.cost) + ' 코인'}</Button>
          </div>}
        </div>
      </section>}
      {posts.some((p) => p.kind !== 'post') && <StoryRail stories={posts.filter((p) => p.kind !== 'post')} onOpen={setPreview} creators={state.creators} accounts={state.accounts} />}
      <h2 className="font-black">구독자 전용 게시글</h2>
      {posts.filter((p) => p.kind === 'post').map((post) => <PostCard key={post.id} {...{ post, account, openCreator, openChat, notify }} />)}
      {!posts.some((p) => p.kind === 'post') && <Empty title="아직 게시글이 없어요" />}
    </div> : <Empty icon={LockKeyhole} title="구독자 전용 콘텐츠" description="구독하면 모든 게시글, 스토리, 라이브 미리보기와 크리에이터 상점이 열려요." />}
    {preview && <ContentPreview post={state.posts.find((p) => p.id === preview)} account={account} onClose={() => setPreview(null)} />}
    {offer?.type === 'owned' && <Modal title={offer.name} onClose={() => setOffer(null)}>
      <ProductMedia product={offer} />
      <p className="mt-3 text-sm text-dim">{offer.detail}</p>
    </Modal>}
    {offer && offer.type !== 'owned' && <Modal title={offer.name} onClose={() => setOffer(null)}>
      {offer.type === 'product' && <ProductThumbnail product={offer} className="mb-4 aspect-video w-full" />}
      <p className="mb-4 text-sm leading-relaxed text-dim">{offer.type === 'subscribe'
        ? krw(creator.price) + ' / 월 · 모의 구독을 시작할까요?'
        : number(offer.cost) + ' 코인' + (staff ? ' / 1회' : ' · 보유 ' + number(state.balances[account.id] ?? 0) + ' 코인')}</p>
      {offer.rewards && <ul className="mb-4 space-y-1 rounded-xl bg-night p-4">{offer.rewards.map((reward, index) => <li key={index} className="flex justify-between gap-3 text-sm"><span>{reward.name}</span><span className="text-mint">{reward.chance}%</span></li>)}</ul>}
      {!staff && <Button className="w-full" onClick={() => {
        const result = offer.type === 'subscribe' ? state.subscribe(id) : state.spend(id, offer.type, offer.id)
        const success = { subscribe: '구독을 시작했어요.', product: '구매한 콘텐츠를 열 수 있어요.', roulette: '룰렛 결과 · ' + result.reward }
        notify(result, success[offer.type])
        if (!result.error) setOffer(null)
      }}>{offer.type === 'roulette' ? '코인으로 돌리기' : '확인'}</Button>}
    </Modal>}
  </>
}

export function Store({ account, notify }) {
  const state = useApp()
  const [pack, setPack] = useState(null)
  return <>
    <PageTitle label="COIN STORE" title="코인 스토어" subtitle="크리에이터의 개별 콘텐츠와 룰렛에 코인을 사용할 수 있어요." />
    <div className={`${panel} mb-5 flex items-center justify-between bg-[linear-gradient(105deg,#182f35,#121b25_80%)] p-5 sm:p-6`}>
      <div><p className="text-sm text-dim">내 보유 코인</p><p className="mt-2 text-3xl font-black tabular-nums">{number(state.balances[account.id] ?? 0)} <span className="text-sm text-mint">코인</span></p></div>
      <Coins size={34} className="text-mint" />
    </div>
    <div className="mb-8 grid gap-3 sm:grid-cols-3">
      {packs.map((item) => <article key={item.coins} className={`${panel} flex flex-col gap-3 p-4`}>
        <p className="text-xs font-bold text-dim">{item.name}</p><p className="text-xl font-black">{number(item.coins)} 코인</p>
        <Button tone="subtle" onClick={() => setPack(item)}>{krw(item.won)} · 충전</Button>
      </article>)}
    </div>
    <Ledger title="나의 거래 내역" items={state.transactions.filter((t) => t.customer === account.id)} />
    {pack && <Modal title="코인 충전" onClose={() => setPack(null)}>
      <p className="mb-4 text-sm text-dim">{number(pack.coins)} 코인을 모의 충전합니다. 실제로 청구되는 금액은 없습니다.</p>
      <Button className="w-full" onClick={() => { notify(state.topUp(pack.coins), '코인을 충전했어요.'); setPack(null) }}>{krw(pack.won)} · 모의 결제</Button>
    </Modal>}
  </>
}
