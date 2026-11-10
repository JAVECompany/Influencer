import Avatar from '../../../shared/components/ui/media/Avatar'
import { panel } from '../../../shared/styles/controlStyles'
import type { Account, Creator } from '../../../shared/types/account'

export default function ChatPartnerList({
  ids,
  thread,
  other,
  accounts,
  onSelect,
}: {
  ids: string[]
  thread: string | null
  other: (id: string) => Account | Creator | undefined
  accounts: Record<string, Account>
  onSelect: (id: string) => void
}) {
  return (
    <section
      className={`${panel} overflow-hidden p-2 ${thread ? 'hidden md:block' : ''}`}
      aria-label="대화 목록"
    >
      {ids.map((id) => (
        <button
          key={id}
          type="button"
          aria-pressed={thread === id}
          onClick={() => onSelect(id)}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold ${
            thread === id ? 'bg-accent-soft text-accent' : 'hover:bg-foreground/5'
          }`}
        >
          <Avatar person={other(id)} account={accounts[id]} className="size-9" />
          <span className="truncate">{other(id)?.name ?? id}</span>
        </button>
      ))}
    </section>
  )
}
