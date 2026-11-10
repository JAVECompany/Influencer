import { useState } from 'react'
import { BadgeCheck, CircleDollarSign, ClipboardList, Eye, FileText, Layers3, PackagePlus, Shield, Sparkles, Trash2, UserRoundCheck, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { kindNames, krw, number, relativeTime, roles } from './data'
import { audienceForCreator, isPublic, subscriberCount, tracksAudience, useApp } from './store'
import { Avatar, Badge, Button, Empty, field, fileData, Label, Modal, PageTitle, panel } from './ui'
import { Ledger } from './shared'
import { ContentPreview } from './customer'
import { ProductCard, ProductMedia } from './product-media'
import { RouletteEditor } from './roulette-editor'
import { RouletteWheelDialog } from './roulette-wheel'
import { displayShare } from './roulette'
import type { ActionResult, ApplicationMethod, Content, ContentKind, Creator, PageProps, Product } from './types'

const statusText = { pending: '검토 대기', approved: '승인', rejected: '반려' }
const value = (data: FormData, key: string) => String(data.get(key) ?? '')

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return <div className={`${panel} min-w-0 p-4 sm:p-5`}>
    <div className="flex items-center justify-between gap-2 text-sm text-dim">{label}<Icon size={17} className="shrink-0 text-mint" /></div>
    <p className="mt-3 text-xl font-black break-words tabular-nums sm:text-2xl">{value}</p>
  </div>
}

type OperatorProps = Pick<PageProps, 'account' | 'notify'>
export function Application({ account, notify }: OperatorProps) {
  const state = useApp()
  const [method, setMethod] = useState<ApplicationMethod>('link')
  const creator = state.creators[account.id]
  return <>
    <PageTitle label="CREATOR APPLICATION" title="크리에이터 입점" subtitle="Instagram 계정을 연결하거나 기본 정보를 직접 입력하세요." />
    {creator && <div className={`${panel} mb-5 p-5`}><Badge>{statusText[creator.status]}</Badge>
      <p className="mt-3 text-sm break-words text-dim">{creator.reason || '운영팀이 신청 내용을 확인하고 있어요. 승인 후 스튜디오를 이용할 수 있습니다.'}</p>
    </div>}
    {creator?.status !== 'pending' && <form className={`${panel} grid gap-4 p-5 sm:p-6`} onSubmit={(event) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      notify(state.apply({ method, instagram: value(data, 'instagram'), name: value(data, 'name'), handle: value(data, 'handle'),
        email: value(data, 'email'), bio: value(data, 'bio') }), '심사 요청을 보냈어요.')
    }}>
      <div className="flex flex-wrap gap-2">
        <Button aria-pressed={method === 'link'} tone={method === 'link' ? 'primary' : 'subtle'} onClick={() => setMethod('link')}>Instagram 링크</Button>
        <Button aria-pressed={method === 'direct'} tone={method === 'direct' ? 'primary' : 'subtle'} onClick={() => setMethod('direct')}>직접 입력</Button>
      </div>
      {method === 'link' ? <Label title="Instagram 프로필 링크"><input type="url" name="instagram" required className={field} placeholder="https://www.instagram.com/handle" defaultValue={creator?.instagram} /></Label> :
        <div className="grid gap-4 sm:grid-cols-2">
          <Label title="표시 이름"><input name="name" required maxLength={20} className={field} defaultValue={creator?.name || account.name} /></Label>
          <Label title="Instagram 핸들"><input name="handle" required maxLength={30} className={field} defaultValue={creator?.handle} /></Label>
          <Label title="연락 이메일"><input type="email" name="email" required maxLength={100} className={field} defaultValue={creator?.email} /></Label>
          <Label title="소개"><input name="bio" required maxLength={240} className={field} defaultValue={creator?.bio} /></Label>
        </div>}
      <p className="text-xs text-dim">데모에는 Instagram 비밀번호, 주민등록번호, 계좌번호를 입력하지 마세요.</p>
      <Button type="submit" className="justify-self-start">입점 심사 요청</Button>
    </form>}
  </>
}

export function Studio({ account, notify }: OperatorProps) {
  const state = useApp()
  const [dialog, setDialog] = useState<'publish' | 'settings' | Content | null>(null)
  const [kind, setKind] = useState<ContentKind>('post')
  const [preview, setPreview] = useState<string | null>(null)
  const [audienceId, setAudienceId] = useState<string | null>(null)
  const creator = state.creators[account.id]
  const posts = state.posts.filter((p) => p.owner === account.id)
  const audiencePost = posts.find((p) => p.id === audienceId)
  const viewers = audienceForCreator(state, audiencePost)
  const finish = (result: ActionResult, message: string) => {
    notify(result, message)
    if (!result.error) setDialog(null)
  }
  return <>
    <PageTitle label="CREATOR STUDIO" title="스튜디오" subtitle={creator.name + '님의 구독 콘텐츠를 관리하세요.'}>
      <Button onClick={() => { setKind('post'); setDialog('publish') }}><FileText size={17} /> 콘텐츠 등록</Button>
    </PageTitle>
    <div className="mb-5 grid gap-3 sm:grid-cols-3">
      <Stat label="구독자" value={number(subscriberCount(state, account.id)) + '명'} icon={UsersRound} />
      <Stat label="월 구독료" value={krw(creator.price)} icon={CircleDollarSign} />
      <Stat label="등록 콘텐츠" value={posts.length + '개'} icon={Layers3} />
    </div>
    <section className={`${panel} mb-5 flex flex-wrap items-center justify-between gap-3 p-5`}>
      <div><p className="font-black">공개 프로필</p><p className="mt-1 text-sm break-words text-dim">@{creator.handle} · {creator.bio}</p></div>
      <Button tone="subtle" onClick={() => setDialog('settings')}>구독료 · 소개 수정</Button>
    </section>
    <section className={`${panel} divide-y divide-edge`}>
      <h2 className="p-5 font-black">내 콘텐츠</h2>
      {!posts.length && <p className="p-5 text-sm text-dim">등록된 콘텐츠가 없어요.</p>}
      {posts.map((p) => {
        const label = p.kind === 'live' ? '참여자' : '조회 고객'
        return <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="min-w-0"><p className="text-sm font-bold break-words">{p.title}</p><p className="mt-1 text-xs text-dim">{kindNames[p.kind]} · {relativeTime(p.at)}{p.hidden && ' · 운영자 숨김'}</p></div>
          <div className="flex flex-wrap gap-2">
            {tracksAudience(p) && <Button tone="subtle" onClick={() => setAudienceId(p.id)}>
              <UsersRound size={16} aria-hidden="true" />{label} {number(audienceForCreator(state, p).length)}명
            </Button>}
            <Button tone="plain" aria-label={p.title + ' 미리보기'} onClick={() => setPreview(p.id)}><Eye size={17} /></Button>
            <Button tone="plain" aria-label={p.title + ' 삭제'} onClick={() => setDialog(p)}><Trash2 size={17} /></Button>
          </div>
        </div>
      })}
    </section>
    {preview && <ContentPreview post={state.posts.find((p) => p.id === preview)} account={account} onClose={() => setPreview(null)} />}
    {audiencePost && <Modal title={audiencePost.kind === 'live' ? '라이브 참여자 명단' : '스토리 조회 고객 목록'} onClose={() => setAudienceId(null)}>
      <p className="text-sm font-bold break-words">{audiencePost.title} · {number(viewers.length)}명</p>
      {audiencePost.kind === 'live' && <p className="mt-1 text-xs text-dim">이 데모에서는 라이브 미리보기를 연 고객을 집계합니다.</p>}
      {viewers.length ? <ul className="mt-4 grid gap-2">
        {viewers.map((viewer) => <li key={viewer.id} className="flex items-center gap-3 rounded-xl bg-night p-2.5 text-sm font-bold">
          <Avatar account={viewer} className="size-8" /><span className="min-w-0 break-words">{viewer.name}</span>
        </li>)}
      </ul> : <p className="mt-4 text-sm text-dim">아직 집계된 고객이 없어요.</p>}
    </Modal>}
    {dialog === 'publish' && <Modal title="콘텐츠 등록" onClose={() => setDialog(null)}>
      <form className="grid gap-4" onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const file = data.get('media')
        try {
          const media = file instanceof File && file.size ? await fileData(file) : ''
          finish(state.publish({ title: value(data, 'title'), body: value(data, 'body'), kind, media }), '콘텐츠를 등록했어요.')
        } catch (error) {
          notify({ error: error instanceof Error ? error.message : '파일을 읽을 수 없습니다.' })
        }
      }}>
        <Label title="유형"><select className={field} value={kind} onChange={(event) => {
          const next = event.target.value
          if (next === 'post' || next === 'story' || next === 'live') setKind(next)
        }}>
          <option value="post">게시글</option><option value="story">스토리 · 24시간</option><option value="live">라이브 미리보기</option>
        </select></Label>
        <Label title="제목"><input name="title" required maxLength={80} className={field} /></Label>
        <Label title="내용"><textarea name="body" required maxLength={500} rows={3} className={field} /></Label>
        <Label title="이미지 (선택 · 280 KB 이하)"><input name="media" type="file" accept="image/png,image/jpeg,image/webp" className={field} /></Label>
        {kind === 'live' && <p className="text-xs text-dim">구독자 홈에 편성 미리보기가 표시됩니다.</p>}
        <Button type="submit">구독자에게 공개</Button>
      </form>
    </Modal>}
    {dialog === 'settings' && <Modal title="공개 프로필 설정" onClose={() => setDialog(null)}>
      <form className="grid gap-4" onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        finish(state.editCreator(Number(data.get('price')), value(data, 'bio')), '공개 프로필을 저장했어요.')
      }}>
        <Label title="월 구독료 (원)"><input name="price" required type="number" min={1000} max={100000} defaultValue={creator.price} className={field} /></Label>
        <Label title="소개"><textarea name="bio" required maxLength={240} rows={3} defaultValue={creator.bio} className={field} /></Label>
        <Button type="submit">저장</Button>
      </form>
    </Modal>}
    {dialog && typeof dialog === 'object' && <Modal title="콘텐츠 삭제" onClose={() => setDialog(null)}>
      <p className="mb-4 text-sm text-dim">{dialog.title} 콘텐츠를 삭제할까요?</p>
      <Button className="w-full" tone="danger" onClick={() => finish(state.managePost(dialog.id, 'remove'), '콘텐츠를 삭제했어요.')}>삭제</Button>
    </Modal>}
  </>
}

export function Catalog({ account, notify }: OperatorProps) {
  const state = useApp()
  const [dialog, setDialog] = useState<'product' | 'roulette-preview' | 'roulette' | Product | null>(null)
  const [preview, setPreview] = useState<Product | null>(null)
  const products = state.products.filter((p) => p.owner === account.id && !p.archived)
  const roulette = state.roulettes[account.id]
  const finish = (result: ActionResult, message: string) => {
    notify(result, message)
    if (!result.error) setDialog(null)
  }
  return <>
    <PageTitle label="CREATOR SHOP" title="상품 · 룰렛" subtitle="구독자가 코인으로 이용할 데모 상품을 구성하세요.">
      <Button onClick={() => setDialog('product')}><PackagePlus size={17} /> 상품 등록</Button>
    </PageTitle>
    <div className={`${panel} mb-4 p-5`}>
      <h2 className="mb-3 font-black">개별 상품</h2>
      {!products.length && <p className="text-sm text-dim">등록된 상품이 없어요.</p>}
      <div className="grid gap-2">{products.map((p) => <ProductCard key={p.id} product={p}>
        <span className="text-xs text-dim">{number(p.cost)} 코인</span>
        <Button tone="subtle" onClick={() => setPreview(p)}>콘텐츠 열기</Button>
        <Button tone="plain" aria-label={p.name + ' 판매 종료'} onClick={() => setDialog(p)}><Trash2 size={17} /></Button>
      </ProductCard>)}</div>
    </div>
    <div className={`${panel} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-black"><Sparkles size={17} className="text-mint" /> 룰렛</h2>
        <div className="flex flex-wrap gap-2">
          {roulette && <Button tone="subtle" onClick={() => setDialog('roulette-preview')}>미리보기</Button>}
          <Button tone="subtle" onClick={() => setDialog('roulette')}>{roulette ? '설정 수정' : '룰렛 등록'}</Button>
        </div></div>
      {roulette ? <div className="mt-3 grid gap-2 text-sm text-dim">
        <p>{number(roulette.cost)} 코인 / 1회</p>
        {roulette.topPrizeCost != null && <p>1등 확정 구매 · {number(roulette.topPrizeCost)} 코인</p>}
        {roulette.rewards.map((r, i) => <p key={i} className="flex flex-wrap justify-between gap-3 rounded-lg bg-night px-3 py-2"><span>{i + 1}번 · {r.name}</span><span>표시 {displayShare(r)}% · 실제 {r.chance}%</span></p>)}
      </div> : <p className="mt-3 text-sm text-dim">설정된 룰렛이 없어요.</p>}
      <p className="mt-4 text-xs text-dim">고객 데모에는 번호가 표시된 원판을 보여 줍니다. 원판 표시 비중과 실제 추첨 확률은 이 설정에서 확인할 수 있어요.</p>
    </div>
    {preview && <Modal title={preview.name} onClose={() => setPreview(null)} protectedContent><ProductMedia product={preview} viewer={account.id} /></Modal>}
    {dialog === 'product' && <Modal title="개별 상품 등록" onClose={() => setDialog(null)}>
      <form className="grid gap-4" onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const file = data.get('media')
        try {
          const media = file instanceof File && file.size ? await fileData(file, true) : ''
          finish(state.addProduct(value(data, 'name'), value(data, 'detail'), Number(data.get('cost')), media), '상품을 등록했어요.')
        } catch (error) {
          notify({ error: error instanceof Error ? error.message : '파일을 읽을 수 없습니다.' })
        }
      }}>
        <Label title="상품명"><input name="name" required maxLength={60} className={field} /></Label>
        <Label title="상품 설명"><input name="detail" required maxLength={220} className={field} placeholder="예시 · 미공개 사진 3장" /></Label>
        <Label title="가격 (코인)"><input name="cost" type="number" required min={1} max={10000} className={field} /></Label>
        <Label title="구매 콘텐츠 사진·영상 (선택 · 280 KB 이하)"><input name="media" type="file" accept="image/png,image/jpeg,image/webp,video/mp4,video/webm" className={field} /></Label>
        <Button type="submit">상품 등록</Button>
      </form>
    </Modal>}
    {dialog === 'roulette-preview' && <RouletteWheelDialog roulette={roulette} mode="preview" onClose={() => setDialog(null)} />}
    {dialog === 'roulette' && <RouletteEditor roulette={roulette} onClose={() => setDialog(null)}
      onSave={({ cost, rewards, topPrizeCost }) => finish(state.saveRoulette(cost, rewards, topPrizeCost), '룰렛을 저장했어요.')} />}
    {dialog && typeof dialog === 'object' && <Modal title="상품 판매 종료" onClose={() => setDialog(null)}>
      <p className="mb-4 text-sm text-dim">{dialog.name} 판매를 종료할까요?</p>
      <Button className="w-full" tone="danger" onClick={() => finish(state.removeProduct(dialog.id), '판매를 종료했어요.')}>판매 종료</Button>
    </Modal>}
  </>
}

export function Earnings({ account }: Pick<PageProps, 'account'>) {
  const state = useApp()
  const items = state.transactions.filter((t) => t.owner === account.id)
  const month = new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', timeZone: 'Asia/Seoul' })
  const [period, setPeriod] = useState(month.format(Date.now()))
  const filtered = items.filter((t) => !period || month.format(t.at) === period)
  const revenue = filtered.filter((t) => t.type === 'subscribe').reduce((sum, t) => sum + (t.won ?? 0), 0)
  const used = filtered.filter((t) => ['product', 'roulette'].includes(t.type)).reduce((sum, t) => sum + (t.coins ?? 0), 0)
  return <>
    <PageTitle label="TRANSACTIONS" title="수익 내역" subtitle="데모 거래 원장 · 수수료, 환불, 송금 정책은 협의 중입니다.">
      <Label title="조회 월"><input type="month" className={field} value={period} onChange={(event) => setPeriod(event.target.value)} /></Label>
    </PageTitle>
    <div className="mb-5 grid gap-3 sm:grid-cols-2">
      <Stat label="구독 결제 합계" value={krw(revenue)} icon={CircleDollarSign} />
      <Stat label="크리에이터 코인 소비" value={number(used) + ' 코인'} icon={Sparkles} />
    </div>
    <Ledger items={filtered} />
  </>
}

export function AdminHome({ go }: Pick<PageProps, 'go'>) {
  const state = useApp()
  const pending = Object.values(state.creators).filter((c) => c.status === 'pending').length
  const reported = state.posts.filter((p) => p.reports.length > 0 && !p.hidden).length
  return <>
    <PageTitle label="OPERATIONS" title="운영 개요" subtitle="심사 요청, 계정, 신고와 거래를 한 곳에서 관리하세요." />
    <div className="grid gap-3 sm:grid-cols-3">
      <Stat label="검토 대기" value={pending + '건'} icon={ClipboardList} />
      <Stat label="공개 크리에이터" value={Object.keys(state.creators).filter((id) => isPublic(state, id)).length + '명'} icon={UserRoundCheck} />
      <Stat label="공개 신고 콘텐츠" value={reported + '건'} icon={Shield} />
    </div>
    <section className={`${panel} mt-5 p-5`}>
      <h2 className="font-black">오늘의 운영</h2>
      <p className="mt-2 text-sm text-dim">심사 요청과 고객 신고를 확인하세요.</p>
      <div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => go('review')}>심사 요청 보기</Button><Button tone="subtle" onClick={() => go('home')}>전체 피드 보기</Button><Button tone="subtle" onClick={() => go('moderate')}>콘텐츠 관리</Button></div>
    </section>
  </>
}

export function Review({ notify }: Pick<PageProps, 'notify'>) {
  const state = useApp()
  const [target, setTarget] = useState<Creator | null>(null)
  const applicants = Object.values(state.creators).filter((c) => c.method)
    .sort((a, b) => Number(b.status === 'pending') - Number(a.status === 'pending'))
  return <>
    <PageTitle label="APPLICATIONS" title="심사 요청 목록" subtitle="크리에이터의 신청 정보를 확인한 뒤 검색 공개 여부를 결정하세요." />
    {!applicants.length ? <Empty icon={BadgeCheck} title="아직 접수된 심사 요청이 없어요" description="크리에이터가 심사를 요청하면 이곳에 표시됩니다." /> :
      <div className="grid gap-3">{applicants.map((c) => <article className={`${panel} p-5`} key={c.id}>
        <div className="mb-3 flex items-center gap-3"><Avatar person={c} account={state.accounts[c.id]} className="size-10" /><div className="min-w-0 flex-1"><h2 className="truncate font-black">{c.name}</h2><p className="text-xs text-dim">@{c.handle} · {c.method === 'link' ? '링크 접수' : '직접 입력'}</p></div><Badge>{statusText[c.status]}</Badge></div>
        {c.instagram && <a className="text-sm break-all text-mint underline" href={c.instagram} target="_blank" rel="noreferrer">Instagram 프로필 확인</a>}
        {c.email && <p className="text-sm break-all text-dim">{c.email} · {c.bio}</p>}
        {c.reason && <p className="mt-2 text-sm text-dim">{c.reason}</p>}
        {c.status === 'pending' && <div className="mt-4 flex gap-2">
          <Button onClick={() => notify(state.review(c.id, 'approved'), '신청을 승인했어요.')}>승인</Button>
          <Button tone="danger" onClick={() => setTarget(c)}>반려</Button>
        </div>}
      </article>)}</div>}
    {target && <Modal title={target.name + ' 신청 반려'} onClose={() => setTarget(null)}>
      <form className="grid gap-3" onSubmit={(event) => {
        event.preventDefault()
        const result = state.review(target.id, 'rejected', value(new FormData(event.currentTarget), 'reason'))
        notify(result, '신청을 반려했어요.')
        if (!result.error) setTarget(null)
      }}><Label title="신청자에게 표시할 사유"><textarea name="reason" required maxLength={180} className={field} rows={3} /></Label><Button type="submit" tone="danger">반려 확정</Button></form>
    </Modal>}
  </>
}

export function Moderate({ account, notify, openCreator }: OperatorProps & Pick<PageProps, 'openCreator'>) {
  const state = useApp()
  const [tab, setTab] = useState('content')
  const [preview, setPreview] = useState<string | null>(null)
  const posts = [...state.posts].sort((a, b) => b.reports.length - a.reports.length || b.at - a.at)
  return <>
    <PageTitle label="MODERATION" title="운영 관리" subtitle="콘텐츠 공개 상태와 계정 이용 권한을 관리하세요." />
    <div className="mb-4 flex gap-2">
      <Button tone={tab === 'content' ? 'primary' : 'subtle'} aria-pressed={tab === 'content'} onClick={() => setTab('content')}>콘텐츠</Button>
      <Button tone={tab === 'accounts' ? 'primary' : 'subtle'} aria-pressed={tab === 'accounts'} onClick={() => setTab('accounts')}>계정</Button>
    </div>
    <section className={`${panel} divide-y divide-edge`}>
      {tab === 'content' ? posts.map((p) => <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="min-w-0"><p className="text-sm font-black break-words">{p.title}</p><p className="mt-1 text-xs text-dim">
          <button type="button" aria-label={(state.creators[p.owner]?.name ?? p.owner) + ' 크리에이터 상세'} onClick={() => openCreator(p.owner)} className="font-bold text-mint hover:underline">{state.creators[p.owner]?.name ?? p.owner}</button>
          {' · '}{kindNames[p.kind]} · 신고 {p.reports.length}건 · {p.hidden ? '숨김' : '공개'}</p></div>
        <div className="flex gap-2"><Button tone="plain" onClick={() => setPreview(p.id)}>열람</Button><Button tone="subtle" onClick={() => notify(state.managePost(p.id, 'hide'), p.hidden ? '다시 공개했어요.' : '콘텐츠를 숨겼어요.')}>{p.hidden ? '공개' : '숨김'}</Button></div>
      </div>) : Object.values(state.accounts).map((a) => <div key={a.id} className="flex items-center gap-3 p-4">
        <Avatar account={a} person={state.creators[a.id]} className="size-10" />
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{a.name}</p><p className="mt-1 text-xs text-dim">{roles[a.role]} · {a.disabled ? '정지' : '이용 중'}</p></div>
        {a.role !== 'admin' && <Button tone={a.disabled ? 'subtle' : 'danger'} onClick={() => notify(state.toggleAccount(a.id), a.disabled ? '이용을 복구했어요.' : '이용을 정지했어요.')}>{a.disabled ? '복구' : '이용 정지'}</Button>}
      </div>)}
    </section>
    {preview && <ContentPreview post={state.posts.find((p) => p.id === preview)} account={account} onClose={() => setPreview(null)} />}
  </>
}
