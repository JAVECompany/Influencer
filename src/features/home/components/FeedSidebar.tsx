import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import Avatar from '../../../shared/components/ui/Avatar'
import Button from '../../../shared/components/ui/Button'
import { panel } from '../../../shared/styles/controlStyles'
import type { Account, Creator } from '../../../shared/types/account'
import type { PageProps } from '../../../shared/types/navigation'

export default function FeedSidebar({
  staff,
  spotlight,
  accounts,
  openCreator,
  go,
}: Pick<PageProps, 'openCreator' | 'go'> & {
  staff: boolean
  spotlight: Creator[]
  accounts: Record<string, Account>
}) {
  return (
    <aside className="hidden gap-4 xl:grid">
      {!staff && (
        <section className={`${panel} p-4`}>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-mint" />
            <h2 className="text-sm font-black">새로운 크리에이터</h2>
          </div>
          {spotlight.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => openCreator(c.id)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5"
            >
              <Avatar person={c} account={accounts[c.id]} className="size-9" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{c.name}</span>
                <span className="block truncate text-xs text-dim">@{c.handle}</span>
              </span>
              <ArrowRight size={15} className="text-dim" />
            </button>
          ))}
          <Button tone="plain" className="mt-2 w-full justify-between" onClick={() => go('search')}>
            전체 탐색 <ArrowRight size={16} />
          </Button>
        </section>
      )}
      <div className="flex items-start gap-3 px-2 py-3 text-xs leading-relaxed text-dim">
        <ShieldCheck size={17} className="shrink-0 text-mint" />
        <span>구독 전용 콘텐츠는 다른 탭으로 전환하면 가려집니다.</span>
      </div>
    </aside>
  )
}
