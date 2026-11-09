import { useEffect, useRef, useState } from 'react'
import { Bell, CreditCard, KeyRound, LogOut, MessageCircle, ReceiptText, Send, UserRound } from 'lucide-react'
import { krw, number, relativeTime, roles } from './data'
import { hasSubscription, useApp } from './store'
import { Avatar, Badge, Button, Empty, field, fileData, Label, Modal, PageTitle, panel } from './ui'

const txnNames = { subscribe: '구독 시작', unsubscribe: '구독 해지', topup: '코인 충전', product: '상품 구매', roulette: '룰렛 참여' }

export function Ledger({ title = '거래 내역', items, showParties = false }) {
  const state = useApp()
  return <section className={`${panel} overflow-hidden`}>
    <h2 className="flex items-center gap-2 px-5 py-4 font-black"><ReceiptText size={17} className="text-mint" /> {title}</h2>
    {!items.length && <p className="border-t border-edge p-5 text-sm text-dim">표시할 거래 내역이 없어요.</p>}
    {items.map((t) => <div key={t.id} className="flex items-center justify-between gap-4 border-t border-edge px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-bold break-words">{txnNames[t.type]}{t.reward && ' · ' + t.reward}</p>
        <p className="mt-1 text-xs break-words text-dim">{[showParties && state.accounts[t.customer]?.name, state.creators[t.owner]?.name, relativeTime(t.at)].filter(Boolean).join(' · ')}</p>
      </div>
      <p className="shrink-0 text-right text-sm font-bold text-mint">{t.coins ? (t.type === 'topup' ? '+' : '−') + number(t.coins) + ' 코인' : t.won ? krw(t.won) : '—'}</p>
    </div>)}
  </section>
}

export function Profile({ account, notify, openCreator }) {
  const state = useApp()
  const [dialog, setDialog] = useState(null)
  const creator = state.creators[account.id]
  const subs = (state.subscriptions[account.id] ?? []).map((id) => state.creators[id]).filter(Boolean)
  const [name, setName] = useState(account.name)
  const [payment, setPayment] = useState(account.payment)
  const save = (changes, message) => {
    const result = state.profile(changes)
    notify(result, message)
    if (!result.error) setDialog(null)
  }
  return <>
    <PageTitle label="MY ACCOUNT" title="프로필" subtitle="내 계정과 이용 환경을 관리하세요." />
    <section className={`${panel} mb-5 flex flex-wrap items-center gap-4 p-5`}>
      <Avatar account={account} person={creator} className="size-[72px] text-xl" />
      <div className="min-w-0 flex-1"><h2 className="text-xl font-black break-words">{account.name}</h2><p className="mt-1 text-xs text-dim">{account.id}</p></div>
      <Badge>{roles[account.role]}</Badge>
    </section>
    <section className={`${panel} mb-5 divide-y divide-edge`}>
      <button className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-mint" onClick={() => { setName(account.name); setDialog('profile') }}><UserRound size={18} className="text-mint" /> 프로필 이미지 · 닉네임</button>
      <button className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-mint" onClick={() => setDialog('password')}><KeyRound size={18} className="text-mint" /> 비밀번호 변경</button>
      {account.role !== 'admin' && <button className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-mint" onClick={() => { setPayment(account.payment); setDialog('payment') }}>
        <CreditCard size={18} className="text-mint" /> {account.role === 'customer' ? '결제 계좌 · 수단' : '정산 수단'} <span className="ml-auto text-xs text-dim">{account.payment || '미등록'}</span>
      </button>}
      <button role="switch" aria-checked={account.notifications} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-mint"
        onClick={() => notify(state.profile({ notifications: !account.notifications }), '알림 설정을 저장했어요.')}>
        <Bell size={18} className="text-mint" /> 전체 알림 <span className={`ml-auto rounded-full px-3 py-1 text-xs ${account.notifications ? 'bg-mint text-night' : 'bg-edge text-dim'}`}>{account.notifications ? 'ON' : 'OFF'}</span>
      </button>
    </section>
    {account.role === 'customer' && <section className={`${panel} mb-5 p-5`}>
      <h2 className="mb-4 font-black">구독 관리</h2>
      {subs.length === 0 && <p className="text-sm text-dim">구독 중인 크리에이터가 없어요.</p>}
      <div className="grid gap-2">{subs.map((c) => <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-night p-3">
        <button className="flex items-center gap-2 text-sm font-bold hover:text-mint" onClick={() => openCreator(c.id)}><Avatar person={c} account={state.accounts[c.id]} className="size-8" />{c.name}</button>
        <Button tone="plain" onClick={() => setDialog(c)}>구독 해지</Button>
      </div>)}</div>
    </section>}
    <Button tone="subtle" onClick={state.signOut}><LogOut size={16} /> 로그아웃</Button>
    {dialog === 'profile' && <Modal title="프로필 수정" onClose={() => setDialog(null)}>
      <form className="grid gap-4" onSubmit={async (event) => {
        event.preventDefault()
        const file = new FormData(event.currentTarget).get('avatar')
        try {
          const avatar = file?.size ? await fileData(file) : account.avatar
          save({ name, avatar }, '프로필을 저장했어요.')
        } catch (error) {
          notify({ error: error.message })
        }
      }}>
        <Label title="닉네임"><input required maxLength={20} className={field} value={name} onChange={(event) => setName(event.target.value)} /></Label>
        <Label title="프로필 이미지 (280 KB 이하)"><input name="avatar" type="file" accept="image/png,image/jpeg,image/webp" className={field} /></Label>
        <Button type="submit">저장</Button>
      </form>
    </Modal>}
    {dialog === 'password' && <Modal title="비밀번호 변경" onClose={() => setDialog(null)}>
      <form className="grid gap-4" onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        if (data.get('next') !== data.get('confirm')) return notify({ error: '새 비밀번호 확인이 일치하지 않아요.' })
        save({ current: data.get('current'), password: data.get('next') }, '비밀번호를 변경했어요.')
      }}>
        <Label title="현재 비밀번호"><input name="current" type="password" required autoComplete="current-password" className={field} /></Label>
        <Label title="새 비밀번호"><input name="next" type="password" required minLength={6} maxLength={72} autoComplete="new-password" className={field} /></Label>
        <Label title="새 비밀번호 확인"><input name="confirm" type="password" required autoComplete="new-password" className={field} /></Label>
        <Button type="submit">변경</Button>
      </form>
    </Modal>}
    {dialog === 'payment' && <Modal title="데모 결제·정산 수단" onClose={() => setDialog(null)}>
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); save({ payment }, '수단을 저장했어요.') }}>
        <p className="text-sm text-dim">가상의 계좌 또는 결제수단을 선택하세요.</p>
        <Label title="데모 수단"><select className={field} value={payment} onChange={(event) => setPayment(event.target.value)}>
          <option value="">미등록</option>
          <option value="가상 국내 계좌">가상 국내 계좌</option>
          {account.role === 'customer' ? <option value="가상 카드">가상 카드</option> : <option value="가상 미국 수취 계좌">가상 미국 수취 계좌</option>}
        </select></Label>
        <Button type="submit">저장</Button>
      </form>
    </Modal>}
    {dialog && typeof dialog === 'object' && <Modal title="구독 해지" onClose={() => setDialog(null)}>
      <p className="mb-4 text-sm text-dim">{dialog.name} 구독을 해지하면 전용 콘텐츠와 채팅 이용이 종료돼요.</p>
      <Button className="w-full" tone="danger" onClick={() => { notify(state.unsubscribe(dialog.id), '구독을 해지했어요.'); setDialog(null) }}>구독 해지</Button>
    </Modal>}
  </>
}

export function Chat({ account, initial, notify }) {
  const state = useApp()
  const [selected, setSelected] = useState(initial ?? null)
  const [text, setText] = useState('')
  const customerView = account.role === 'customer'
  const ids = customerView
    ? (state.subscriptions[account.id] ?? []).filter((id) => hasSubscription(state, account.id, id))
    : Object.keys(state.subscriptions).filter((id) => !state.accounts[id]?.disabled && hasSubscription(state, id, account.id))
  const other = (id) => customerView ? state.creators[id] : state.accounts[id]
  const thread = ids.includes(selected) ? selected : null
  const messages = thread ? state.messages.filter((m) => customerView ? m.customer === account.id && m.creator === thread : m.creator === account.id && m.customer === thread) : []
  const log = useRef(null)
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight
  }, [thread, messages.length])
  return <>
    <PageTitle label="INBOX" title="채팅" subtitle={customerView ? '구독 중인 크리에이터와 이야기를 나눠 보세요.' : '구독자가 보낸 메시지를 확인하세요.'} />
    {!ids.length ? <Empty icon={MessageCircle} title="아직 대화 상대가 없어요" /> : <div className="grid items-start gap-4 md:grid-cols-[210px_minmax(0,1fr)]">
      <section className={`${panel} overflow-hidden p-2 ${thread ? 'hidden md:block' : ''}`} aria-label="대화 목록">
        {ids.map((id) => <button key={id} type="button" aria-pressed={thread === id} onClick={() => { setSelected(id); setText('') }}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold ${thread === id ? 'bg-[#193338] text-mint' : 'hover:bg-white/5'}`}>
          <Avatar person={other(id)} account={state.accounts[id]} className="size-9" /><span className="truncate">{other(id)?.name ?? id}</span>
        </button>)}
      </section>
      {thread ? <section className={`${panel} min-w-0 overflow-hidden`} aria-label="선택한 대화">
        <header className="flex items-center justify-between border-b border-edge px-4 py-3 text-sm font-black">
          <span>{other(thread)?.name ?? thread}</span><Button tone="plain" className="md:hidden" onClick={() => setSelected(null)}>대화 목록</Button>
        </header>
        <div ref={log} className="flex h-[48dvh] flex-col gap-2 overflow-y-auto p-4" role="log">
          {!messages.length && <p className="text-sm text-dim">첫 메시지를 남겨 보세요.</p>}
          {messages.map((m) => <p key={m.id} className={`max-w-[88%] rounded-xl px-3 py-2 text-sm break-words whitespace-pre-wrap ${m.from === account.id ? 'self-end bg-[#23534e] text-white' : 'self-start bg-night text-dim'}`}>{m.text}</p>)}
        </div>
        <form className="flex gap-2 border-t border-edge p-3" onSubmit={(event) => {
          event.preventDefault()
          const result = state.sendMessage(thread, text)
          if (result.error) notify(result)
          else setText('')
        }}>
          <input aria-label="메시지" className={field} placeholder="메시지를 입력하세요" maxLength={500} value={text} onChange={(event) => setText(event.target.value)} />
          <Button type="submit" aria-label="보내기" disabled={!text.trim()}><Send size={18} /></Button>
        </form>
      </section> : <div className="hidden md:block"><Empty icon={MessageCircle} title="대화를 선택해 주세요" /></div>}
    </div>}
  </>
}
