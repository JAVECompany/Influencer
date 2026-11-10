import { Move, RotateCcw } from 'lucide-react'
import Button from '../../../shared/components/ui/actions/Button'
import type { PageProps } from '../../../shared/types/navigation'
import { formatNumber } from '../../../shared/utils/format/format'
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
      className="overflow-hidden rounded-[26px] border border-line bg-surface"
      aria-label="크리에이터 구체 탐색"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line/75 px-3 py-2.5 sm:px-5">
        <p className="flex items-center gap-2 text-xs font-bold text-muted">
          <Move size={15} className="text-accent" /> 드래그 또는 방향키로 탐색{' '}
          <span className="ml-1 text-accent">{formatNumber(items.length)}명</span>
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
        className={`relative isolate h-[440px] touch-none overflow-hidden theme-globe select-none sm:h-[500px] ${
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
          <ellipse
            cx="500"
            cy="250"
            rx="485"
            ry="230"
            fill="none"
            stroke="var(--theme-accent)"
            strokeOpacity=".12"
          />
          <ellipse
            cx="500"
            cy="250"
            rx="400"
            ry="156"
            fill="none"
            stroke="var(--theme-accent)"
            strokeOpacity=".12"
          />
          <ellipse
            cx="500"
            cy="250"
            rx="245"
            ry="230"
            fill="none"
            stroke="var(--theme-accent)"
            strokeOpacity=".12"
            transform={`rotate(${(angles.yaw * 5) % 18} 500 250)`}
          />
          <path d="M20 250H980M500 20V480" stroke="var(--theme-accent)" strokeOpacity=".09" />
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
      </div>
    </section>
  )
}
