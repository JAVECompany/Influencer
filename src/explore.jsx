import { useLayoutEffect, useRef, useState } from 'react'
import { Check, Compass, Move, RotateCcw, Search } from 'lucide-react'
import { number } from './data'
import { hasSubscription, isPublic, subscriberCount, useApp } from './store'
import { Avatar, Button, Empty, PageTitle, panel } from './ui'

const startingAngles = { yaw: 0, pitch: 0 }
const angleStep = 0.008
const goldenAngle = Math.PI * (3 - Math.sqrt(5))
const circleSize = (count, peak, compact) =>
  Math.round((34 + 74 * (count / peak) ** 0.57) * (compact ? 0.72 : 1))

function CreatorBubble({ item, size, onClick, style, disabled }) {
  const { creator, count, subscribed, account } = item
  return <button type="button" onClick={onClick} style={{ ...style, '--portrait-size': size + 'px' }} disabled={disabled}
    aria-label={creator.name + ' · 구독자 ' + number(count) + '명' + (subscribed ? ' · 구독 중' : '')}
    data-creator={creator.id} data-subscribed={subscribed}
    className="group flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-xl text-center focus-visible:z-10">
    <span className="relative block transition-transform duration-200 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-110">
      <Avatar person={creator} account={account} className={`size-(--portrait-size) border-2 shadow-md ${subscribed ? 'border-mint ring-2 ring-mint/25' : 'border-white/25 group-hover:border-mint/65'}`} />
      <span className="absolute -top-1 -right-2 rounded-full border border-white/20 bg-[#1c303b] px-1.5 py-0.5 text-[9px] leading-none font-black text-white tabular-nums" aria-hidden="true">
        {count > 999 ? '999+' : count}
      </span>
      {subscribed && <span aria-hidden="true" className="absolute right-0 bottom-0 grid size-4 place-items-center rounded-full bg-mint text-night"><Check size={11} strokeWidth={3} /></span>}
    </span>
    <span className={`w-full truncate px-1 text-[10px] font-bold leading-tight sm:text-[11px] ${subscribed ? 'text-mint' : 'text-white'}`}>{creator.name}</span>
  </button>
}

function globeCards(orbit, width, height, angles, reserved, peak) {
  const compact = width < 560
  const radiusX = width * (compact ? 0.57 : 0.51)
  const radiusY = height * 0.49
  const occupied = [reserved]
  const visible = []
  const sinYaw = Math.sin(angles.yaw)
  const cosYaw = Math.cos(angles.yaw)
  const sinPitch = Math.sin(angles.pitch)
  const cosPitch = Math.cos(angles.pitch)
  orbit.forEach((item, index) => {
    const z = 0.86 - 1.83 * index / Math.max(1, orbit.length - 1)
    const ring = Math.sqrt(1 - z * z)
    const theta = index * goldenAngle - 1.48
    const x = Math.cos(theta) * ring
    const y = Math.sin(theta) * ring
    const rotX = cosYaw * x + sinYaw * z
    const depth = -sinYaw * x + cosYaw * z
    const rotY = cosPitch * y - sinPitch * depth
    const rotZ = sinPitch * y + cosPitch * depth
    if (rotZ < 0.01) return
    const size = Math.round(circleSize(item.count, peak, compact) * (0.64 + 0.36 * rotZ))
    const left = width / 2 + radiusX * rotX
    const top = height / 2 + radiusY * rotY
    const w = Math.max(44, size + 10)
    const h = size + 18
    const box = [left - w / 2, top - h / 2, left + w / 2, top + h / 2]
    if (box[0] < 5 || box[1] < 6 || box[2] > width - 5 || box[3] > height - 6) return
    if (occupied.some(([x1, y1, x2, y2]) => box[0] < x2 && box[2] > x1 && box[1] < y2 && box[3] > y1)) return
    occupied.push(box)
    visible.push({ item, size, left, top, width: w, depth: rotZ })
  })
  return visible
}

function CreatorGlobe({ items, peak, openCreator }) {
  const viewport = useRef(null)
  const gesture = useRef(null)
  const ignoreClick = useRef(false)
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 })
  const [angles, setAngles] = useState(startingAngles)
  const [dragging, setDragging] = useState(false)
  useLayoutEffect(() => {
    const element = viewport.current
    const sync = () => setDimensions({ width: element.clientWidth, height: element.clientHeight })
    const observer = new ResizeObserver(sync)
    sync()
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const pinned = items.filter((item) => item.subscribed).map((item) => ({
    item, size: circleSize(item.count, peak, width < 560),
  }))
  const reserveWidth = Math.min(Math.max(0, width - 32), Math.max(150, 20 + pinned.reduce((total, { size }) => total + Math.max(48, size + 10), 0)))
  const reserveHeight = 43 + Math.max(24, ...pinned.map(({ size }) => size))
  const reserved = [width / 2 - reserveWidth / 2 - 6, height / 2 - reserveHeight / 2 - 3, width / 2 + reserveWidth / 2 + 6, height / 2 + reserveHeight / 2 + 3]
  const visible = globeCards(items.filter((item) => !item.subscribed), width, height, angles, reserved, peak)
  const move = (dx, dy, origin) => ({
    yaw: (origin.yaw + dx) % (2 * Math.PI),
    pitch: (origin.pitch + dy) % (2 * Math.PI),
  })
  const end = () => {
    gesture.current = null
    setDragging(false)
  }
  return <section className="overflow-hidden rounded-[26px] border border-edge bg-[#0e1722]" aria-label="크리에이터 구체 탐색">
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-edge/75 px-3 py-2.5 sm:px-5">
      <p className="flex items-center gap-2 text-xs font-bold text-dim"><Move size={15} className="text-mint" /> 드래그 또는 방향키로 탐색 <span className="ml-1 text-mint">{number(items.length)}명</span></p>
      <Button tone="plain" className="min-h-8 px-2 py-1 text-xs" onClick={() => setAngles(startingAngles)}><RotateCcw size={14} /> 처음 위치</Button>
    </header>
    <div ref={viewport} tabIndex={0} aria-label="크리에이터 지구본, 방향키로 회전" data-constellation
      className={`relative isolate h-[440px] touch-none overflow-hidden bg-[radial-gradient(ellipse_at_center,#253e4a_0%,#182734_40%,#0e1722_76%)] select-none sm:h-[500px] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onPointerDown={(event) => {
        if (event.button !== 0 || event.target.closest('[data-pinned]')) return
        ignoreClick.current = false
        gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, angles }
      }}
      onPointerMove={(event) => {
        const drag = gesture.current
        if (drag?.id !== event.pointerId) return
        const dx = event.clientX - drag.x
        const dy = event.clientY - drag.y
        if (!ignoreClick.current && Math.hypot(dx, dy) < 6) return
        if (!ignoreClick.current) {
          event.currentTarget.setPointerCapture(event.pointerId)
          ignoreClick.current = true
          setDragging(true)
        }
        setAngles(move(dx * angleStep, dy * angleStep, drag.angles))
      }}
      onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
      onPointerLeave={() => { if (!ignoreClick.current) end() }}
      onKeyDown={(event) => {
        const steps = { ArrowLeft: [-0.32, 0], ArrowRight: [0.32, 0], ArrowUp: [0, -0.32], ArrowDown: [0, 0.32] }
        const step = steps[event.key]
        if (!step || event.target.closest('[data-pinned]')) return
        event.preventDefault()
        setAngles((old) => move(...step, old))
      }}>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full opacity-60" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <ellipse cx="500" cy="250" rx="485" ry="230" fill="none" stroke="#63d6c3" strokeOpacity=".12" />
        <ellipse cx="500" cy="250" rx="400" ry="156" fill="none" stroke="#63d6c3" strokeOpacity=".12" />
        <ellipse cx="500" cy="250" rx="245" ry="230" fill="none" stroke="#63d6c3" strokeOpacity=".12" transform={`rotate(${angles.yaw * 5 % 18} 500 250)`} />
        <path d="M20 250H980M500 20V480" stroke="#63d6c3" strokeOpacity=".09" />
      </svg>
      {visible.map(({ item, size, left, top, width: cardWidth, depth }) => <div key={item.creator.id}
        className="absolute -translate-x-1/2 -translate-y-1/2 hover:z-10 focus-within:z-10"
        style={{ left, top, width: cardWidth, opacity: 0.64 + depth * 0.36 }}>
        <CreatorBubble item={item} size={size} style={{ width: '100%' }} onClick={(event) => {
          if (!ignoreClick.current || event.detail === 0) openCreator(item.creator.id)
        }} />
      </div>)}
      <section data-pinned aria-label="내 구독 크리에이터" style={{ width: reserveWidth || undefined }}
        className="absolute top-1/2 left-1/2 z-20 max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 cursor-default rounded-3xl border border-mint/25 bg-[#102329]/90 px-2 py-2 text-center shadow-[0_0_34px_#0b171f]">
        <h2 className="mb-1 text-[10px] font-black tracking-widest text-mint">내 구독</h2>
        {pinned.length ? <div className="flex touch-pan-x gap-1 overflow-x-auto py-1" tabIndex={pinned.length > 3 ? 0 : undefined}>
          <div className="mx-auto flex w-max items-end gap-1">
            {pinned.map(({ item, size }) => <CreatorBubble key={item.creator.id} item={item} size={size} style={{ width: Math.max(44, size + 6) }} onClick={() => openCreator(item.creator.id)} />)}
          </div>
        </div> : <p className="px-2 py-2 text-[10px] text-dim">구독한 프로필이 여기에 표시돼요.</p>}
      </section>
    </div>
  </section>
}

export function Explore({ account, openCreator }) {
  const state = useApp()
  const [query, setQuery] = useState('')
  const term = query.trim().replace(/^@/, '').toLowerCase()
  const items = Object.values(state.creators).filter((creator) => isPublic(state, creator.id)).map((creator) => ({
    creator, account: state.accounts[creator.id], count: subscriberCount(state, creator.id),
    subscribed: hasSubscription(state, account.id, creator.id),
  })).sort((a, b) => b.count - a.count)
  const matches = items.filter(({ creator }) => creator.name.toLowerCase().includes(term) || creator.handle.toLowerCase().includes(term))
  const peak = items[0]?.count || 1
  return <>
    <PageTitle label="DISCOVER" title="크리에이터 탐색" subtitle="중앙에는 내 구독, 주변에는 새로운 크리에이터가 표시됩니다." />
    <label className={`${panel} mb-5 flex items-center gap-3 px-4`}>
      <Search size={19} className="text-dim" />
      <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="닉네임 또는 핸들 검색" placeholder="닉네임 또는 @핸들 검색" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-dim" />
    </label>
    {!matches.length ? <Empty icon={Compass} title="검색 결과가 없어요" description="다른 닉네임이나 핸들로 검색해 보세요." /> :
      term ? <div className={`${panel} flex flex-wrap items-center justify-center gap-4 p-5`}>{matches.map((item) =>
        <CreatorBubble key={item.creator.id} item={item} size={circleSize(item.count, peak, true)} style={{ width: 91 }} onClick={() => openCreator(item.creator.id)} />,
      )}</div> : <CreatorGlobe items={items} peak={peak} openCreator={openCreator} />}
  </>
}
