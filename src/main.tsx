import { StrictMode, useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, CheckCircle2, CircleAlert, ClipboardCheck, Coins, Home as HomeIcon, LayoutDashboard, LogOut, MessageCircle, Search, Shield, ShoppingBag, Sparkles, UserRound, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { demos, number, roles } from './data'
import { actor, useApp } from './store'
import { Brand, Button, Feedback, field, Label, panel, Scene, Avatar } from './ui'
import { CreatorDetail, Home, Store } from './customer'
import { Explore } from './explore'
import { AdminSettlement } from './admin-settlement'
import { Chat, Profile } from './shared'
import { AdminHome, Application, Catalog, Earnings, Moderate, Review, Studio } from './operator'
import { ContentPrivacy, usePagePrivacyMask, usePrintPrivacyMask } from './content-privacy'
import type { Notify, PageKey, PageProps, Role } from './types'
import './index.css'

type NavItem = [PageKey, string, LucideIcon]
const navItems: Record<Role, NavItem[]> = {
  customer: [['home', '홈', HomeIcon], ['search', '검색', Search], ['chat', '채팅', MessageCircle], ['store', '스토어', ShoppingBag], ['profile', '프로필', UserRound]],
  influencer: [['studio', '스튜디오', LayoutDashboard], ['chat', '채팅', MessageCircle], ['catalog', '상품', ShoppingBag], ['earnings', '수익', Wallet], ['profile', '프로필', UserRound]],
  admin: [['ops', '운영', LayoutDashboard], ['home', '홈', HomeIcon], ['review', '심사', ClipboardCheck], ['moderate', '관리', Shield], ['settlement', '정산', Wallet], ['profile', '프로필', UserRound]],
}
const applicationNav: NavItem[] = [['apply', '입점', ClipboardCheck], ['profile', '프로필', UserRound]]
const pages: Record<PageKey, ComponentType<PageProps>> = { home: Home, search: Explore, chat: Chat, store: Store, profile: Profile, studio: Studio, catalog: Catalog, earnings: Earnings, settlement: AdminSettlement, ops: AdminHome, review: Review, moderate: Moderate, apply: Application }

function Auth({ notify }: Pick<PageProps, 'notify'>) {
  const state = useApp()
  const [signup, setSignup] = useState(false)
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [adult, setAdult] = useState(false)
  const [terms, setTerms] = useState(false)
  return <main className="mx-auto grid min-h-dvh max-w-[1330px] items-center gap-8 px-5 py-9 lg:grid-cols-[1.25fr_1fr] lg:px-12 lg:py-12">
    <section className="relative hidden min-h-[650px] overflow-hidden rounded-[36px] border border-edge bg-[#172338] lg:flex lg:flex-col">
      <Scene className="absolute inset-0 h-full w-full opacity-80" />
      <div className="absolute inset-0 bg-linear-to-b from-[#0c1625]/90 via-transparent to-[#0b1421]" />
      <div className="relative z-10 p-9"><Brand /></div>
      <div className="relative z-10 mt-auto p-9 xl:p-12">
        <p className="mb-4 flex items-center gap-2 text-xs font-black tracking-[.2em] text-mint"><Sparkles size={16} /> YOUR PRIVATE ORBIT</p>
        <h1 className="text-4xl leading-[1.16] font-black tracking-tight xl:text-5xl">좋아하는 이야기와<br />더 가까이.</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#d7e1ec]">구독으로 이어지는 크리에이터의 일상, 밤결에서 만나보세요.</p>
      </div>
    </section>
    <section className="mx-auto w-full max-w-[450px]">
      <div className="mb-8 lg:hidden"><Brand /></div>
      <p className="mb-2 text-xs font-bold tracking-[.18em] text-mint">{signup ? 'CREATE ACCOUNT' : 'BAMGYEOL DEMO'}</p>
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{signup ? '밤결에 가입하기' : '밤결에 오신 걸 환영해요'}</h2>
      <p className="mt-3 mb-6 text-sm leading-relaxed text-dim">{signup ? '같은 브라우저에서 가입과 입점 흐름을 체험할 수 있어요.' : '로그인하고 역할별 화면을 체험해 보세요.'}</p>
      <form className="grid gap-4" onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        if (signup) {
          notify(state.signUp({ id, password, terms, adult, name: String(data.get('name') ?? ''), role: String(data.get('role') ?? '') }), '데모 계정을 만들었어요.')
        } else notify(state.signIn(id, password))
      }}>
        {signup && <>
          <Label title="가입 유형"><select name="role" className={field}><option value="customer">고객</option><option value="influencer">크리에이터</option></select></Label>
          <label className="flex items-start gap-2 text-sm text-dim"><input type="checkbox" required checked={terms} onChange={(event) => setTerms(event.target.checked)} className="mt-1 accent-mint" />데모 이용 조건에 동의합니다. 입력 정보는 이 브라우저에 저장됩니다.</label>
          <Button tone="subtle" onClick={() => setAdult(!adult)} aria-pressed={adult}>{adult ? '만 19세 이상 확인 완료 · 모의' : 'PASS 성인 확인 체험 · 만 19세 이상'}</Button>
        </>}
        <Label title="아이디"><input required value={id} onChange={(event) => setId(event.target.value)} className={field} maxLength={24} autoComplete="username" placeholder="아이디 입력" /></Label>
        <Label title="비밀번호"><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={field} minLength={signup ? 6 : undefined} maxLength={72} autoComplete={signup ? 'new-password' : 'current-password'} placeholder="비밀번호 입력" /></Label>
        {signup && <Label title="닉네임"><input required name="name" maxLength={20} className={field} placeholder="중복되지 않는 닉네임" /></Label>}
        <Button type="submit" className="mt-1 min-h-12 justify-between">{signup ? '데모 계정 만들기' : '로그인'} <ArrowRight size={17} /></Button>
      </form>
      {!signup && <div className={`${panel} mt-5 p-4`}>
        <p className="mb-3 text-xs font-bold text-dim">체험 계정 · 선택하면 아이디와 비밀번호가 입력돼요</p>
        <div className="grid grid-cols-3 gap-2">{demos.map((demo) => <Button key={demo.id} tone="subtle" className="px-1 text-xs" onClick={() => { setId(demo.id); setPassword(demo.id) }}>{roles[demo.role]}</Button>)}</div>
      </div>}
      <Button tone="plain" className="mt-3 w-full" onClick={() => { setSignup(!signup); setId(''); setPassword(''); setAdult(false); setTerms(false) }}>{signup ? '로그인으로 돌아가기' : '새 데모 계정 만들기'}</Button>
    </section>
  </main>
}

function Workspace({ account, notify }: Pick<PageProps, 'account' | 'notify'>) {
  const state = useApp()
  const nav = account.role === 'influencer' && state.creators[account.id]?.status !== 'approved' ? applicationNav : navItems[account.role]
  const [tab, setTab] = useState(nav[0][0])
  const [detail, setDetail] = useState<string | null>(null)
  const [chat, setChat] = useState<string | null>(null)
  const current = nav.some(([id]) => id === tab) ? tab : nav[0][0]
  const Page = pages[current]
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' })
  const go = (id: PageKey) => {
    setTab(id)
    setDetail(null)
    setChat(null)
    scrollTop()
  }
  const openCreator = (id: string) => { setDetail(id); scrollTop() }
  const openChat = (id: string) => { setDetail(null); setTab('chat'); setChat(id); scrollTop() }
  const navButtons = nav.map(([id, title, Icon]) => <button key={id} type="button" aria-current={current === id ? 'page' : undefined} onClick={() => go(id)}
    className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-[10px] font-bold transition sm:text-xs lg:w-full lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:px-3.5 lg:py-3 lg:text-sm ${current === id ? 'bg-[#163337] text-mint' : 'text-dim hover:bg-white/5 hover:text-white'}`}>
    <Icon size={20} strokeWidth={current === id ? 2.5 : 1.85} aria-hidden="true" /><span className="truncate">{title}</span>
  </button>)
  return <div className="min-h-dvh">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[220px] flex-col border-r border-edge/75 bg-[#0e151d] px-4 py-6 lg:flex">
      <button type="button" className="mb-10 px-2 text-left" onClick={() => go(nav[0][0])}><Brand /></button>
      <p className="mb-3 px-3 text-[10px] font-bold tracking-[.16em] text-dim">{account.role === 'customer' ? '나의 궤도' : roles[account.role] + ' 워크스페이스'}</p>
      <nav aria-label="주 메뉴" className="grid gap-1.5">{navButtons}</nav>
      <div className="mt-auto rounded-xl border border-edge p-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar person={state.creators[account.id]} account={account} className="size-9" />
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-black">{account.name}</p><p className="mt-0.5 text-[10px] text-dim">{roles[account.role]}</p></div>
          <button type="button" aria-label="로그아웃" className="rounded-lg p-1.5 text-dim hover:bg-white/5 hover:text-white" onClick={state.signOut}><LogOut size={16} /></button>
        </div>
      </div>
      <p className="mt-3 px-1 text-[10px] text-dim">BAMGYEOL · 프론트엔드 데모</p>
    </aside>
    <div className="lg:ml-[220px]">
      <header className="sticky top-0 z-20 border-b border-edge/75 bg-night/92 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-[1130px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
          <button type="button" className="text-left lg:hidden" onClick={() => go(nav[0][0])}><Brand /></button>
          <p className="hidden text-xs font-bold tracking-[.16em] text-dim lg:block">{roles[account.role]} <span className="px-1 text-edge">/</span> {detail ? '크리에이터' : nav.find(([id]) => id === current)?.[1]}</p>
          <div className="flex min-w-0 items-center gap-2.5">
            {account.role === 'customer' && <button type="button" onClick={() => go('store')} className="flex items-center gap-1.5 rounded-full border border-edge px-2.5 py-1.5 text-xs font-bold text-mint hover:border-mint"><Coins size={14} />{number(state.balances[account.id] ?? 0)} <span className="hidden sm:inline">코인</span></button>}
            <span className="truncate rounded-full bg-panel px-2.5 py-1.5 text-[10px] font-bold text-dim">DEMO · {roles[account.role]}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1130px] px-4 pt-6 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:px-7 sm:pt-8 lg:px-10 lg:pb-12">
        {detail && ['customer', 'admin'].includes(account.role)
          ? <CreatorDetail key={detail} id={detail} account={account} back={() => { setDetail(null); scrollTop() }} {...{ openCreator, openChat, notify }} />
          : <Page key={current + (chat ?? '')} {...{ account, openCreator, openChat, go, notify }} initial={chat} />}
      </main>
    </div>
    <nav aria-label="모바일 주 메뉴" className="fixed inset-x-0 bottom-0 z-30 flex gap-1 border-t border-edge bg-[#0e151d]/98 px-2 pt-1.5 pb-[calc(.4rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">{navButtons}</nav>
  </div>
}

function App() {
  const account = useApp(actor)
  const inactive = usePagePrivacyMask()
  const printing = usePrintPrivacyMask()
  const [message, setMessage] = useState<{ text: string; error: boolean; accountId: string | null } | null>(null)
  const notify: Notify = (result, success) => {
    const text = result.error || success
    setMessage(text ? { text, error: Boolean(result.error), accountId: useApp.getState().session } : null)
  }
  useEffect(() => {
    if (!message) return
    const timeout = setTimeout(() => setMessage(null), 4400)
    return () => clearTimeout(timeout)
  }, [message])
  const feedback = message?.accountId === (account?.id ?? null) ? message : null
  const Icon = feedback?.error ? CircleAlert : CheckCircle2
  return <ContentPrivacy.Provider value={printing ? 'print' : inactive ? 'inactive' : null}>
    <Feedback.Provider value={feedback}>
      {account ? <Workspace key={account.id} account={account} notify={notify} /> : <Auth notify={notify} />}
      {feedback && <div data-toast role={feedback.error ? 'alert' : 'status'} className="pointer-events-none fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[100] flex justify-center lg:bottom-6">
        <span className={`inline-flex items-center gap-2 rounded-xl border bg-[#101922] px-4 py-3 text-sm font-bold shadow-xl ${feedback.error ? 'border-red-300/50 text-red-200' : 'border-mint/40 text-mint'}`}><Icon size={17} className="shrink-0" />{feedback.text}</span>
      </div>}
    </Feedback.Provider>
  </ContentPrivacy.Provider>
}

const root = document.getElementById('root')
if (!root) throw new Error('App root not found')
createRoot(root).render(<StrictMode><App /></StrictMode>)
