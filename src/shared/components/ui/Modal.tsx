import { useContext, useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { ContentPrivacyContext } from '../../contexts/contentPrivacyContext'
import { FeedbackContext } from '../../contexts/feedbackContext'

export default function Modal({
  title,
  onClose,
  children,
  protectedContent = false,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  protectedContent?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const heading = useId()
  const message = useContext(FeedbackContext)
  const mask = useContext(ContentPrivacyContext)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return (
    <dialog
      ref={ref}
      aria-labelledby={heading}
      data-protected={protectedContent || undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-auto rounded-2xl border border-edge bg-panel p-5 text-white shadow-2xl sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={heading} className="text-lg font-black">
          {protectedContent && mask ? '구독 전용 콘텐츠' : title}
        </h2>
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="grid size-10 shrink-0 place-items-center rounded-xl text-dim hover:bg-white/10"
        >
          <X size={19} />
        </button>
      </div>
      {message?.error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-300/40 bg-red-400/10 px-3 py-2.5 text-sm text-red-200"
        >
          {message.text}
        </p>
      )}
      {children}
    </dialog>
  )
}
