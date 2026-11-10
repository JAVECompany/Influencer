import { useContext } from 'react'
import type { ReactNode, SyntheticEvent } from 'react'
import { LockKeyhole } from 'lucide-react'
import { ContentPrivacyContext } from '../../contexts/contentPrivacyContext'

export default function ProtectedContent({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const mask = useContext(ContentPrivacyContext)
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
      {mask && (
        <div className="absolute inset-0 grid place-content-center gap-2 bg-night/95 text-center text-xs text-dim">
          <LockKeyhole className="mx-auto" size={20} />
          {mask === 'print' ? '인쇄 중에는 콘텐츠를 가립니다.' : '탭으로 돌아오면 다시 볼 수 있어요.'}
        </div>
      )}
    </div>
  )
}
