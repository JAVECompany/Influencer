import { Move, RotateCcw } from 'lucide-react'
import Button from '../../../shared/components/ui/Button'
import type { PageProps } from '../../../shared/types/navigation'
import { formatNumber } from '../../../shared/utils/format'
import { useCreatorGlobe } from '../hooks/useCreatorGlobe'
import type { ExploreItem } from '../types/creatorDiscovery'
import CreatorBubble from './CreatorBubble'

export default function CreatorGlobe({
  items,
  peak,
  openCreator,
}: {
  items: ExploreItem[]
  peak: number
  openCreator: PageProps['openCreator']
}) {
  const {
    viewport,
    dragging,
    angles,
    pinned,
    reserveWidth,
    visible,
    beginDrag,
    drag,
    end,
    leave,
    rotateByKey,
    reset,
    acceptsClick,
  } = useCreatorGlobe(items, peak)

  return (
    <section
      className="overflow-hidden rounded-[26px] border border-edge bg-[#0e1722]"
      aria-label="크리에이터 구체 탐색"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-edge/75 px-3 py-2.5 sm:px-5">
        <p className="flex items-center gap-2 text-xs font-bold text-dim">
          <Move size={15} className="text-mint" /> 드래그 또는 방향키로 탐색{' '}
          <span className="ml-1 text-mint">{formatNumber(items.length)}명</span>
        </p>
        <Button tone="plain" className="min-h-8 px-2 py-1 text-xs" onClick={reset}>
          <RotateCcw size={14} /> 처음 위치
        </Button>
      </header>
      <div
        ref={viewport}
        tabIndex={0}
        aria-label="크리에이터 지구본, 방향키로 회전"
        data-constellation
        className={`relative isolate h-[440px] touch-none overflow-hidden bg-[radial-gradient(ellipse_at_center,#253e4a_0%,#182734_40%,#0e1722_76%)] select-none sm:h-[500px] ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={beginDrag}
        onPointerMove={drag}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
        onPointerLeave={leave}
        onKeyDown={rotateByKey}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full opacity-60"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
        >
          <ellipse cx="500" cy="250" rx="485" ry="230" fill="none" stroke="#63d6c3" strokeOpacity=".12" />
          <ellipse cx="500" cy="250" rx="400" ry="156" fill="none" stroke="#63d6c3" strokeOpacity=".12" />
          <ellipse
            cx="500"
            cy="250"
            rx="245"
            ry="230"
            fill="none"
            stroke="#63d6c3"
            strokeOpacity=".12"
            transform={`rotate(${(angles.yaw * 5) % 18} 500 250)`}
          />
          <path d="M20 250H980M500 20V480" stroke="#63d6c3" strokeOpacity=".09" />
        </svg>
        {visible.map(({ item, size, left, top, width: cardWidth, depth }) => (
          <div
            key={item.creator.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 hover:z-10 focus-within:z-10"
            style={{ left, top, width: cardWidth, opacity: 0.64 + depth * 0.36 }}
          >
            <CreatorBubble
              item={item}
              size={size}
              style={{ width: '100%' }}
              onClick={(event) => {
                if (acceptsClick(event.detail)) openCreator(item.creator.id)
              }}
            />
          </div>
        ))}
        <section
          data-pinned
          aria-label="내 구독 크리에이터"
          style={{ width: reserveWidth || undefined }}
          className="absolute top-1/2 left-1/2 z-20 max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 cursor-default rounded-3xl border border-mint/25 bg-[#102329]/90 px-2 py-2 text-center shadow-[0_0_34px_#0b171f]"
        >
          <h2 className="mb-1 text-[10px] font-black tracking-widest text-mint">내 구독</h2>
          {pinned.length ? (
            <div
              className="flex touch-pan-x gap-1 overflow-x-auto py-1"
              tabIndex={pinned.length > 3 ? 0 : undefined}
            >
              <div className="mx-auto flex w-max items-end gap-1">
                {pinned.map(({ item, size }) => (
                  <CreatorBubble
                    key={item.creator.id}
                    item={item}
                    size={size}
                    style={{ width: Math.max(44, size + 6) }}
                    onClick={() => openCreator(item.creator.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="px-2 py-2 text-[10px] text-dim">구독한 프로필이 여기에 표시돼요.</p>
          )}
        </section>
      </div>
    </section>
  )
}
