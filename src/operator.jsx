import { useState } from 'react'
import { BadgeCheck, CircleDollarSign, ClipboardList, Eye, FileText, Layers3, PackagePlus, Shield, Sparkles, Trash2, UserRoundCheck, UsersRound } from 'lucide-react'
import { kindNames, krw, number, relativeTime, roles } from './data'
import { hasSubscription, isPublic, useApp } from './store'
import { Avatar, Badge, Button, Empty, field, fileData, Label, Modal, PageTitle, panel } from './ui'
import { Ledger } from './shared'
import { ContentPreview } from './customer'

const statusText = { pending: '검토 대기', approved: '승인', rejected: '반려' }
const value = (data, key) => String(data.get(key) ?? '')

function Stat({ label, value, icon: Icon }) {
  return <div className={`${panel} min-w-0 p-4 sm:p-5`}>
    <div className="flex items-center justify-between gap-2 text-sm text-dim">{label}<Icon size={17} className="shrink-0 text-mint" /></div>
    <p className="mt-3 text-xl font-black break-words tabular-nums sm:text-2xl">{value}</p>
  </div>
}

export function Application({ account, notify }) {
  const state = useApp()
  const [method, setMethod] = useState('link')
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

export function Studio({ account, notify }) {
  const state = useApp()
  const [dialog, setDialog] = useState(null)
  const [kind, setKind] = useState('post')
  const [preview, setPreview] = useState(null)
  const creator = state.creators[account.id]
  const posts = state.posts.filter((p) => p.owner === account.id)
  const subscribers = Object.keys(state.subscriptions).filter((id) => hasSubscription(state, id, account.id)).length
  const finish = (result, message) => {
    notify(result, message)
    if (!result.error) setDialog(null)
  }
  return <>
    <PageTitle label="CREATOR STUDIO" title="스튜디오" subtitle={creator.name + '님의 구독 콘텐츠를 관리하세요.'}>
      <Button onClick={() => { setKind('post'); setDialog('publish') }}><FileText size={17} /> 콘텐츠 등록</Button>
    </PageTitle>
    <div className="mb-5 grid gap-3 sm:grid-cols-3">
      <Stat label="구독자" value={number(creator.fans + subscribers) + '명'} icon={UsersRound} />
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
      {posts.map((p) => <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="min-w-0"><p className="text-sm font-bold break-words">{p.title}</p><p className="mt-1 text-xs text-dim">{kindNames[p.kind]} · {relativeTime(p.at)}{p.hidden && ' · 운영자 숨김'}</p></div>
        <div className="flex gap-2">
          <Button tone="plain" aria-label={p.title + ' 미리보기'} onClick={() => setPreview(p.id)}><Eye size={17} /></Button>
          <Button tone="plain" aria-label={p.title + ' 삭제'} onClick={() => setDialog(p)}><Trash2 size={17} /></Button>
        </div>
      </div>)}
    </section>
    {preview && <ContentPreview post={state.posts.find((p) => p.id === preview)} account={account} onClose={() => setPreview(null)} />}
    {dialog === 'publish' && <Modal title="콘텐츠 등록" onClose={() => setDialog(null)}>
      <form className="grid gap-4" onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const file = data.get('media')
        try {
          const media = file?.size ? await fileData(file) : ''
          finish(state.publish({ title: value(data, 'title'), body: value(data, 'body'), kind, media }), '콘텐츠를 등록했어요.')
        } catch (error) {
          notify({ error: error.message })
        }
      }}>
        <Label title="유형"><select className={field} value={kind} onChange={(event) => setKind(event.target.value)}>
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

export function Catalog({ account, notify }) {
  const state = useApp()
  const [dialog, setDialog] = useState(null)
  const [rows, setRows] = useState(2)
  const products = state.products.filter((p) => p.owner === account.id && !p.archived)
  const roulette = state.roulettes[account.id]
  const finish = (result, message) => {
    notify(result, message)
    if (!result.error) setDialog(null)
  }
  return <>
    <PageTitle label="CREATOR SHOP" title="상품 · 룰렛" subtitle="구독자가 코인으로 이용할 데모 상품을 구성하세요.">
      <Button onClick={() => setDialog('product')}><PackagePlus size={17} /> 상품 등록</Button>
    </PageTitle>
    <div className={`${panel} mb-4 divide-y divide-edge`}>
      <h2 className="p-5 font-black">개별 상품</h2>
      {!products.length && <p className="p-5 text-sm text-dim">등록된 상품이 없어요.</p>}
      {products.map((p) => <div key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
        <div className="min-w-0"><p className="text-sm font-bold break-words">{p.name} · {number(p.cost)} 코인</p><p className="mt-1 text-xs break-words text-dim">{p.detail}</p></div>
        <Button tone="plain" aria-label={p.name + ' 판매 종료'} onClick={() => setDialog(p)}><Trash2 size={17} /></Button>
      </div>)}
    </div>
    <div className={`${panel} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-black"><Sparkles size={17} className="text-mint" /> 룰렛</h2>
        <Button tone="subtle" onClick={() => { setRows(roulette?.rewards.length ?? 2); setDialog('roulette') }}>{roulette ? '설정 수정' : '룰렛 등록'}</Button></div>
      {roulette ? <div className="mt-3 grid gap-2 text-sm text-dim">
        <p>{number(roulette.cost)} 코인 / 1회</p>
        {roulette.rewards.map((r, i) => <p key={i} className="flex justify-between gap-3 rounded-lg bg-night px-3 py-2"><span>{r.name}</span><span>{r.chance}%</span></p>)}
      </div> : <p className="mt-3 text-sm text-dim">설정된 룰렛이 없어요.</p>}
      <p className="mt-4 text-xs text-dim">확률은 구독자에게 공개됩니다. 누적 소비 조건과 확정가는 운영 정책에서 검토합니다.</p>
    </div>
    {dialog === 'product' && <Modal title="개별 상품 등록" onClose={() => setDialog(null)}>
      <form className="grid gap-4" onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const file = data.get('media')
        try {
          const media = file?.size ? await fileData(file) : ''
          finish(state.addProduct(value(data, 'name'), value(data, 'detail'), Number(data.get('cost')), media), '상품을 등록했어요.')
        } catch (error) {
          notify({ error: error.message })
        }
      }}>
        <Label title="상품명"><input name="name" required maxLength={60} className={field} /></Label>
        <Label title="상품 설명"><input name="detail" required maxLength={220} className={field} placeholder="예시 · 미공개 사진 3장" /></Label>
        <Label title="가격 (코인)"><input name="cost" type="number" required min={1} max={10000} className={field} /></Label>
        <Label title="구매 콘텐츠 이미지 (선택 · 280 KB 이하)"><input name="media" type="file" accept="image/png,image/jpeg,image/webp" className={field} /></Label>
        <Button type="submit">상품 등록</Button>
      </form>
    </Modal>}
    {dialog === 'roulette' && <Modal title="룰렛 설정" onClose={() => setDialog(null)}>
      <form className="grid gap-3" onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const rewards = Array.from({ length: rows }, (_, i) => ({ name: value(data, 'name' + i), chance: Number(data.get('chance' + i)) }))
        finish(state.saveRoulette(Number(data.get('cost')), rewards), '룰렛을 저장했어요.')
      }}>
        <Label title="1회 이용 (코인)"><input name="cost" type="number" required min={1} max={10000} defaultValue={roulette?.cost} className={field} /></Label>
        {Array.from({ length: rows }, (_, i) => <div key={i} className="grid grid-cols-[minmax(0,1fr)_96px] gap-2">
          <Label title={'보상 ' + (i + 1)}><input name={'name' + i} required maxLength={60} defaultValue={roulette?.rewards[i]?.name} className={field} /></Label>
          <Label title="확률 (%)"><input name={'chance' + i} type="number" required min={1} max={99} defaultValue={roulette?.rewards[i]?.chance} className={field} /></Label>
        </div>)}
        <div className="flex gap-2"><Button tone="plain" disabled={rows === 8} onClick={() => setRows(rows + 1)}>보상 추가</Button><Button tone="plain" disabled={rows === 2} onClick={() => setRows(rows - 1)}>마지막 보상 제거</Button></div>
        <Button type="submit">확률 저장</Button>
      </form>
    </Modal>}
    {dialog && typeof dialog === 'object' && <Modal title="상품 판매 종료" onClose={() => setDialog(null)}>
      <p className="mb-4 text-sm text-dim">{dialog.name} 판매를 종료할까요?</p>
      <Button className="w-full" tone="danger" onClick={() => finish(state.removeProduct(dialog.id), '판매를 종료했어요.')}>판매 종료</Button>
    </Modal>}
  </>
}

export function Earnings({ account }) {
  const state = useApp()
  const items = state.transactions.filter((t) => account.role === 'admin' || t.owner === account.id)
  const month = new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', timeZone: 'Asia/Seoul' })
  const [period, setPeriod] = useState(month.format(Date.now()))
  const filtered = items.filter((t) => !period || month.format(t.at) === period)
  const revenue = filtered.filter((t) => t.type === 'subscribe').reduce((sum, t) => sum + t.won, 0)
  const used = filtered.filter((t) => ['product', 'roulette'].includes(t.type)).reduce((sum, t) => sum + t.coins, 0)
  const charged = filtered.filter((t) => t.type === 'topup').reduce((sum, t) => sum + t.won, 0)
  return <>
    <PageTitle label="TRANSACTIONS" title={account.role === 'admin' ? '거래 · 정산' : '수익 내역'} subtitle="데모 거래 원장 · 수수료, 환불, 송금 정책은 협의 중입니다.">
      <Label title="조회 월"><input type="month" className={field} value={period} onChange={(event) => setPeriod(event.target.value)} /></Label>
    </PageTitle>
    <div className={`mb-5 grid gap-3 sm:grid-cols-2 ${account.role === 'admin' ? 'lg:grid-cols-3' : ''}`}>
      <Stat label="구독 결제 합계" value={krw(revenue)} icon={CircleDollarSign} />
      <Stat label="크리에이터 코인 소비" value={number(used) + ' 코인'} icon={Sparkles} />
      {account.role === 'admin' && <Stat label="코인 충전 결제 합계" value={krw(charged)} icon={CircleDollarSign} />}
    </div>
    <Ledger items={filtered} showParties={account.role === 'admin'} />
  </>
}

export function AdminHome({ go }) {
  const state = useApp()
  const pending = Object.values(state.creators).filter((c) => c.status === 'pending').length
  const reported = state.posts.filter((p) => p.reports.length > 0 && !p.hidden).length
  return <>
    <PageTitle label="OPERATIONS" title="운영 개요" subtitle="입점, 계정, 신고와 거래를 한 곳에서 관리하세요." />
    <div className="grid gap-3 sm:grid-cols-3">
      <Stat label="검토 대기" value={pending + '건'} icon={ClipboardList} />
      <Stat label="공개 크리에이터" value={Object.keys(state.creators).filter((id) => isPublic(state, id)).length + '명'} icon={UserRoundCheck} />
      <Stat label="공개 신고 콘텐츠" value={reported + '건'} icon={Shield} />
    </div>
    <section className={`${panel} mt-5 p-5`}>
      <h2 className="font-black">오늘의 운영</h2>
      <p className="mt-2 text-sm text-dim">새로운 입점 신청과 고객 신고를 확인하세요.</p>
      <div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => go('review')}>입점 신청 보기</Button><Button tone="subtle" onClick={() => go('moderate')}>콘텐츠 관리</Button></div>
    </section>
  </>
}

export function Review({ notify }) {
  const state = useApp()
  const [target, setTarget] = useState(null)
  const applicants = Object.values(state.creators).filter((c) => c.method)
  return <>
    <PageTitle label="APPLICATIONS" title="입점 심사" subtitle="신청 정보를 확인한 뒤 검색 공개 여부를 결정하세요." />
    {!applicants.length ? <Empty icon={BadgeCheck} title="아직 접수된 신청이 없어요" description="인플루언서로 데모 가입 후 입점을 신청하면 이곳에 표시됩니다." /> :
      <div className="grid gap-3">{applicants.map((c) => <article className={`${panel} p-5`} key={c.id}>
        <div className="mb-3 flex items-center gap-3"><Avatar person={c} account={state.accounts[c.id]} className="size-10" /><div className="min-w-0 flex-1"><h2 className="truncate font-black">{c.name}</h2><p className="text-xs text-dim">@{c.handle} · {c.method === 'link' ? '링크 접수' : '직접 입력'}</p></div><Badge>{statusText[c.status]}</Badge></div>
        {c.instagram && <a className="text-sm break-all text-mint underline" href={c.instagram} target="_blank" rel="noreferrer">Instagram 프로필 확인</a>}
        {c.email && <p className="text-sm break-all text-dim">{c.email} · {c.bio}</p>}
        {c.reason && <p className="mt-2 text-sm text-dim">{c.reason}</p>}
        {c.status === 'pending' && <div className="mt-4 flex gap-2">
          <Button onClick={() => notify(state.review(c.id, 'approved'), '입점을 승인했어요.')}>승인</Button>
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

export function Moderate({ account, notify }) {
  const state = useApp()
  const [tab, setTab] = useState('content')
  const [preview, setPreview] = useState(null)
  const posts = [...state.posts].sort((a, b) => b.reports.length - a.reports.length || b.at - a.at)
  return <>
    <PageTitle label="MODERATION" title="운영 관리" subtitle="콘텐츠 공개 상태와 계정 이용 권한을 관리하세요." />
    <div className="mb-4 flex gap-2">
      <Button tone={tab === 'content' ? 'primary' : 'subtle'} aria-pressed={tab === 'content'} onClick={() => setTab('content')}>콘텐츠</Button>
      <Button tone={tab === 'accounts' ? 'primary' : 'subtle'} aria-pressed={tab === 'accounts'} onClick={() => setTab('accounts')}>계정</Button>
    </div>
    <section className={`${panel} divide-y divide-edge`}>
      {tab === 'content' ? posts.map((p) => <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="min-w-0"><p className="text-sm font-black break-words">{p.title}</p><p className="mt-1 text-xs text-dim">{state.creators[p.owner]?.name} · {kindNames[p.kind]} · 신고 {p.reports.length}건 · {p.hidden ? '숨김' : '공개'}</p></div>
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
