import { CheckCircle2, CircleAlert } from 'lucide-react'
import type { FeedbackMessage } from '../../contexts/feedbackContext'

export default function FeedbackToast({ feedback }: { feedback: FeedbackMessage }) {
  const Icon = feedback.error ? CircleAlert : CheckCircle2
  return (
    <div
      data-toast
      role={feedback.error ? 'alert' : 'status'}
      className="pointer-events-none fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[100] flex justify-center lg:bottom-6"
    >
      <span
        className={`inline-flex items-center gap-2 rounded-xl border bg-[#101922] px-4 py-3 text-sm font-bold shadow-xl ${
          feedback.error ? 'border-red-300/50 text-red-200' : 'border-mint/40 text-mint'
        }`}
      >
        <Icon size={17} className="shrink-0" />
        {feedback.text}
      </span>
    </div>
  )
}
