import type { CSSProperties, MouseEventHandler } from 'react'
import { Check } from 'lucide-react'
import Avatar from '../../../shared/components/ui/media/Avatar'
import { formatNumber } from '../../../shared/utils/format/format'
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
  const subscriberCount = formatNumber(count)
  const bubbleStyle: CSSProperties & { '--portrait-size': string } = {
    ...style,
    '--portrait-size': size + 'px',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      style={bubbleStyle}
      aria-label={creator.name + ' · 구독자 ' + subscriberCount + '명' + (subscribed ? ' · 구독 중' : '')}
      data-creator={creator.id}
      data-subscribed={subscribed}
      className="group flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-xl text-center focus-visible:z-10"
    >
      <span className="relative block transition-transform duration-200 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-110">
        <Avatar
          person={creator}
          account={account}
          className={`size-(--portrait-size) border-2 shadow-md ${
            subscribed ? 'border-accent ring-2 ring-accent/25' : 'border-line group-hover:border-accent/65'
          }`}
        />
        <span
          className="absolute -top-0.5 left-1/2 -translate-x-1/2 rounded-full border border-line bg-raised px-1.5 py-0.5 text-[9px] leading-none font-black whitespace-nowrap text-foreground tabular-nums"
          aria-hidden="true"
        >
          {subscriberCount}
        </span>
        {subscribed && (
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 grid size-4 place-items-center rounded-full bg-accent text-on-accent"
          >
            <Check size={11} strokeWidth={3} />
          </span>
        )}
      </span>
      <span
        className={`w-full truncate px-1 text-[10px] font-bold leading-tight sm:text-[11px] ${
          subscribed ? 'text-accent' : 'text-foreground'
        }`}
      >
        {creator.name}
      </span>
    </button>
  )
}
