import type { CSSProperties, MouseEventHandler } from 'react'
import { Check } from 'lucide-react'
import Avatar from '../../../shared/components/ui/Avatar'
import { formatNumber } from '../../../shared/utils/format'
import type { ExploreItem } from '../types/creatorDiscovery'

export default function CreatorBubble({
  item,
  size,
  onClick,
  style,
}: {
  item: ExploreItem
  size: number
  onClick: MouseEventHandler<HTMLButtonElement>
  style?: CSSProperties
}) {
  const { creator, count, subscribed, account } = item
  const bubbleStyle: CSSProperties & { '--portrait-size': string } = {
    ...style,
    '--portrait-size': size + 'px',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      style={bubbleStyle}
      aria-label={creator.name + ' · 구독자 ' + formatNumber(count) + '명' + (subscribed ? ' · 구독 중' : '')}
      data-creator={creator.id}
      data-subscribed={subscribed}
      className="group flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-xl text-center focus-visible:z-10"
    >
      <span className="relative block transition-transform duration-200 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-110">
        <Avatar
          person={creator}
          account={account}
          className={`size-(--portrait-size) border-2 shadow-md ${
            subscribed ? 'border-mint ring-2 ring-mint/25' : 'border-white/25 group-hover:border-mint/65'
          }`}
        />
        <span
          className="absolute -top-1 -right-2 rounded-full border border-white/20 bg-[#1c303b] px-1.5 py-0.5 text-[9px] leading-none font-black text-white tabular-nums"
          aria-hidden="true"
        >
          {count > 999 ? '999+' : count}
        </span>
        {subscribed && (
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 grid size-4 place-items-center rounded-full bg-mint text-night"
          >
            <Check size={11} strokeWidth={3} />
          </span>
        )}
      </span>
      <span
        className={`w-full truncate px-1 text-[10px] font-bold leading-tight sm:text-[11px] ${
          subscribed ? 'text-mint' : 'text-white'
        }`}
      >
        {creator.name}
      </span>
    </button>
  )
}
