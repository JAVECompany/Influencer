import type { RefObject } from 'react'
import { Send } from 'lucide-react'
import Button from '../../../shared/components/ui/Button'
import { field, panel } from '../../../shared/styles/controlStyles'
import type { Message } from '../../../shared/types/chat'

export default function ChatThread({
  name,
  accountId,
  messages,
  log,
  text,
  onChange,
  onBack,
  onSend,
}: {
  name: string
  accountId: string
  messages: Message[]
  log: RefObject<HTMLDivElement | null>
  text: string
  onChange: (value: string) => void
  onBack: () => void
  onSend: () => void
}) {
  return (
    <section className={`${panel} min-w-0 overflow-hidden`} aria-label="선택한 대화">
      <header className="flex items-center justify-between border-b border-edge px-4 py-3 text-sm font-black">
        <span>{name}</span>
        <Button tone="plain" className="md:hidden" onClick={onBack}>
          대화 목록
        </Button>
      </header>
      <div ref={log} className="flex h-[48dvh] flex-col gap-2 overflow-y-auto p-4" role="log">
        {!messages.length && <p className="text-sm text-dim">첫 메시지를 남겨 보세요.</p>}
        {messages.map((m) => (
          <p
            key={m.id}
            className={`max-w-[88%] rounded-xl px-3 py-2 text-sm break-words whitespace-pre-wrap ${
              m.from === accountId ? 'self-end bg-[#23534e] text-white' : 'self-start bg-night text-dim'
            }`}
          >
            {m.text}
          </p>
        ))}
      </div>
      <form
        className="flex gap-2 border-t border-edge p-3"
        onSubmit={(event) => {
          event.preventDefault()
          onSend()
        }}
      >
        <input
          aria-label="메시지"
          className={field}
          placeholder="메시지를 입력하세요"
          maxLength={500}
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button type="submit" aria-label="보내기" disabled={!text.trim()}>
          <Send size={18} />
        </Button>
      </form>
    </section>
  )
}
