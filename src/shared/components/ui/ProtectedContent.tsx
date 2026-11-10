import { useContext, useState } from 'react'
import type { ReactNode, SyntheticEvent } from 'react'
import { LockKeyhole } from 'lucide-react'
import { ContentPrivacyContext } from '../../contexts/contentPrivacyContext'

const watermarkTime = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul',
  dateStyle: 'short',
  timeStyle: 'short',
})

export default function ProtectedContent({
  viewer,
  children,
  className = '',
}: {
  viewer: string
  children: ReactNode
  className?: string
}) {
  const mask = useContext(ContentPrivacyContext)
  const [openedAt] = useState(() => watermarkTime.format(Date.now()) + ' KST')
  const block = (event: SyntheticEvent) => event.preventDefault()
  return (
    <div
      data-protected
      onContextMenu={block}
      onDragStart={block}
      onCopy={block}
      className={`relative isolate overflow-hidden select-none ${className}`}
    >
      <div className={mask ? 'invisible' : undefined} aria-hidden={Boolean(mask)}>
        {children}
      </div>
      {!mask && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 grid grid-cols-2 place-items-center overflow-hidden text-[10px] font-black tracking-widest text-white/25"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="max-w-full -rotate-17 rounded-md bg-black/20 px-1.5 py-1 text-center text-white/50 sm:px-2"
            >
              <span className="block break-all">{viewer} · 밤결</span>
              <span className="block text-[8px] tracking-normal">{openedAt}</span>
            </span>
          ))}
        </div>
      )}
      {mask && (
        <div className="absolute inset-0 grid place-content-center gap-2 bg-night/95 text-center text-xs text-dim">
          <LockKeyhole className="mx-auto" size={20} />
          {mask === 'print' ? '인쇄 중에는 콘텐츠를 가립니다.' : '탭으로 돌아오면 다시 볼 수 있어요.'}
        </div>
      )}
    </div>
  )
}
