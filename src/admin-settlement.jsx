import { useState } from 'react'
import { Calculator, CalendarDays, Coins, Wallet } from 'lucide-react'
import { krw, number } from './data'
import { dateInKorea, periodOptions, settlementPeriod, summarizeSettlement } from './settlements'
import { useApp } from './store'
import { Ledger } from './shared'
import { Avatar, Badge, Button, field, Label, Modal, PageTitle, panel } from './ui'

function Total({ label, value, detail, icon: Icon, emphasis }) {
  return <div className={`${panel} min-w-0 p-4 ${emphasis ? 'border-mint/35 bg-[#142c30]' : ''}`}>
    <div className="flex items-center justify-between gap-3 text-xs font-bold text-dim">{label}<Icon className="shrink-0 text-mint" size={17} /></div>
    <p className={`mt-3 text-2xl font-black break-words tabular-nums ${emphasis ? 'text-mint' : ''}`}>{value}</p>
    <p className="mt-1 text-xs leading-relaxed text-dim">{detail}</p>
  </div>
}

export function AdminSettlement({ notify }) {
  const state = useApp()
  const [mode, setMode] = useState('month')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [query, setQuery] = useState('')
  const [edit, setEdit] = useState(null)
  const [historyLimit, setHistoryLimit] = useState(12)
  const now = Date.now()
  const today = dateInKorea(now)
  const month = settlementPeriod('month', '', '', now)
  const period = settlementPeriod(mode, start, end, now)
  const current = summarizeSettlement(state, month)
  const report = period && (period.key === month.key ? current : summarizeSettlement(state, period))
  const { coinWon, feeBps } = state.settlement
  const term = query.trim().toLowerCase().replace(/^@/, '')
  const rows = report?.rows.filter(({ creator }) => creator.name.toLowerCase().includes(term) || creator.handle.toLowerCase().includes(term)) ?? []
  const editCoins = (coins) => {
    const result = state.overrideSettlementCoins(period.key, edit.creator.id, coins)
    notify(result, coins === null ? '거래 내역의 코인 수로 복원했어요.' : '선택 기간의 정산 코인 수를 설정했어요.')
    if (!result.error) setEdit(null)
  }

  return <>
    <PageTitle label="SETTLEMENT" title="거래 · 정산" subtitle="고객의 데모 거래를 집계하고 코인 정산 기준을 적용합니다." />
    <section className="mb-7" aria-labelledby="month-settlement">
      <h2 id="month-settlement" className="mb-3 flex items-center gap-2 font-black"><CalendarDays className="text-mint" size={17} />이번 달 지급 예정 <span className="text-xs font-medium text-dim">{month.start.slice(0, 7)} · KST</span></h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Total label="크리에이터 지급 총계" value={krw(current.total.due)} detail="구독권 매출 + 코인 지급액" icon={Wallet} emphasis />
        <Total label="구독권 매출" value={krw(current.total.subs)} detail="이번 달 고객 구독 결제 합계" icon={CalendarDays} />
        <Total label="코인 정산" value={krw(current.total.net)} detail={'플랫폼 코인 수수료 ' + krw(current.total.fee)} icon={Coins} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-dim">지급 예상액에는 구독권 매출 전액과 코인 수수료 공제 후 금액을 반영합니다.</p>
    </section>

    <section className={`${panel} mb-5 p-4 sm:p-5`}>
      <h2 className="mb-3 flex items-center gap-2 font-black"><CalendarDays size={17} className="text-mint" /> 거래 조회 기간</h2>
      <div className="flex flex-wrap gap-2">
        {periodOptions.map(([key, label]) => <Button key={key} aria-pressed={key === mode} tone={key === mode ? 'primary' : 'subtle'} onClick={() => { setMode(key); setHistoryLimit(12) }}>{label}</Button>)}
      </div>
      {mode === 'custom' && <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Label title="시작일"><input type="date" className={field} value={start} max={end || today} onChange={(event) => { setStart(event.target.value); setHistoryLimit(12) }} /></Label>
        <Label title="종료일"><input type="date" className={field} value={end} min={start || undefined} max={today} onChange={(event) => { setEnd(event.target.value); setHistoryLimit(12) }} /></Label>
      </div>}
      <p className="mt-3 text-xs leading-relaxed text-dim">{period ? period.start + ' ~ ' + period.end + ' · 한국시간, 양 끝 날짜 포함' : '시작일과 종료일을 확인해 주세요.'}</p>
    </section>

    <section className={`${panel} mb-5 p-4 sm:p-5`}>
      <h2 className="mb-3 flex items-center gap-2 font-black"><Calculator size={17} className="text-mint" /> 코인 정산 기준</h2>
      <form key={coinWon + ':' + feeBps} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        notify(state.configureSettlement(Number(data.get('unit')), Math.round(Number(data.get('fee')) * 100)), '코인 정산 기준을 저장했어요.')
      }}>
        <Label title="코인 환산 단가 (원 / 코인)"><input type="number" name="unit" min={1} max={10000} required className={field} defaultValue={coinWon} /></Label>
        <Label title="플랫폼 코인 수수료 (%)"><input type="number" name="fee" min={0} max={100} step="0.01" required className={field} defaultValue={feeBps / 100} /></Label>
        <Button type="submit">정산 기준 적용</Button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-dim">현재 {number(coinWon)}원/코인 · {number(feeBps / 100)}%. 코인 충전 묶음 가격과 별개인 데모 환산 단가입니다.</p>
    </section>

    {report && <>
      <section className={`${panel} mb-5 overflow-hidden`}>
        <div className="flex flex-wrap items-end justify-between gap-3 p-4 sm:p-5">
          <div>
            <h2 className="font-black">크리에이터별 정산</h2>
            <p className="mt-1 text-xs text-dim">상품 구매와 룰렛에 실제 사용된 코인을 집계합니다. 직접 입력은 조회 기간과 크리에이터에만 적용합니다.</p>
          </div>
          <input aria-label="정산 크리에이터 검색" className={`${field} sm:w-52`} placeholder="닉네임 또는 핸들" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="max-h-[540px] overflow-auto" tabIndex={0} aria-label="크리에이터 정산 표 스크롤">
          <table className="w-full min-w-[870px] border-collapse text-right text-xs tabular-nums">
            <thead className="sticky top-0 z-10 bg-[#182632] text-dim">
              <tr className="[&>th]:px-3 [&>th]:py-3">
                <th scope="col" className="text-left">크리에이터</th><th scope="col">고객 사용 코인</th><th scope="col">사용 코인 환산액</th>
                <th scope="col">구독권 매출</th><th scope="col">정산 코인</th><th scope="col">코인 지급액</th><th scope="col">플랫폼 수수료</th><th scope="col">지급 예정</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => <tr key={row.creator.id} className="border-t border-edge hover:bg-white/3 [&>td]:px-3 [&>td]:py-2.5">
                <th scope="row" className="px-3 py-2.5 text-left"><span className="flex items-center gap-2 whitespace-nowrap"><Avatar person={row.creator} account={state.accounts[row.creator.id]} className="size-7" />{row.creator.name}</span></th>
                <td>{number(row.coins)}</td><td>{krw(row.actualGross)}</td><td>{krw(row.subs)}</td>
                <td><div className="flex items-center justify-end gap-2 whitespace-nowrap">
                  <span>{number(row.appliedCoins)}</span>{row.adjusted !== undefined && <Badge>수동</Badge>}
                  <Button tone="plain" className="min-h-8 px-2 py-1 text-xs" aria-label={row.creator.name + ' 정산 코인 직접 입력'} onClick={() => setEdit(row)}>직접 입력</Button>
                </div></td>
                <td>{krw(row.net)}</td><td>{krw(row.fee)}</td><td className="font-bold text-mint">{krw(row.due)}</td>
              </tr>)}
            </tbody>
          </table>
          {!rows.length && <p className="p-5 text-sm text-dim">일치하는 크리에이터가 없어요.</p>}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-edge bg-night/50 px-4 py-3 text-xs text-dim">
          <span>선택 기간 코인 합계 <strong className="ml-1 text-white">{number(report.total.coins)}</strong></span>
          <span>코인 정산 총액 <strong className="ml-1 text-white">{krw(report.total.gross)}</strong></span>
          <span>플랫폼 수수료 합계 <strong className="ml-1 text-white">{krw(report.total.fee)}</strong></span>
          <span>전체 지급 예정 <strong className="ml-1 text-mint">{krw(report.total.due)}</strong></span>
        </div>
      </section>
      <section className={`${panel} mb-5 p-4 sm:p-5`}>
        <h2 className="font-black">월별 구독권 매출</h2>
        <p className="mt-1 text-xs text-dim">선택 기간에 포함된 거래를 월별로 모았습니다.</p>
        {report.monthly.length ? <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {report.monthly.map(([date, won]) => <li key={date} className="flex justify-between gap-4 rounded-lg bg-night px-3 py-2 text-sm"><span className="text-dim">{date}</span><strong className="tabular-nums">{krw(won)}</strong></li>)}
        </ul> : <p className="mt-3 text-sm text-dim">이 기간에 구독 결제가 없어요.</p>}
      </section>
      <Ledger title="선택 기간 거래 내역" items={report.items.slice(0, historyLimit)} showParties absoluteDates />
      {historyLimit < report.items.length && <Button tone="subtle" className="mt-3" onClick={() => setHistoryLimit(historyLimit + 20)}>거래 더 보기</Button>}
    </>}
    {edit && period && <Modal title={edit.creator.name + ' 정산 코인 입력'} onClose={() => setEdit(null)}>
      <p className="mb-4 text-sm text-dim">{period.start} ~ {period.end} · 원장에 기록된 사용 코인 {number(edit.coins)}</p>
      <form className="grid gap-4" onSubmit={(event) => {
        event.preventDefault()
        editCoins(Number(new FormData(event.currentTarget).get('coins')))
      }}>
        <Label title="정산에 적용할 코인"><input name="coins" type="number" required min={0} max={10000000} className={field} defaultValue={edit.appliedCoins} /></Label>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">수동 입력 저장</Button>
          {edit.adjusted !== undefined && <Button tone="subtle" onClick={() => editCoins(null)}>원장 수치로 복원</Button>}
        </div>
      </form>
    </Modal>}
  </>
}
