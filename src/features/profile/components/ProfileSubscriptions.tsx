import Avatar from '../../../shared/components/ui/media/Avatar'
import Button from '../../../shared/components/ui/actions/Button'
import { panel } from '../../../shared/styles/controlStyles'
import type { Account, Creator } from '../../../shared/types/account'
import type { PageProps } from '../../../shared/types/navigation'

export default function ProfileSubscriptions({
  subscriptions,
  accounts,
  openCreator,
  onUnsubscribe,
}: Pick<PageProps, 'openCreator'> & {
  subscriptions: Creator[]
  accounts: Record<string, Account>
  onUnsubscribe: (creator: Creator) => void
}) {
  return (
    <section className={`${panel} mb-5 p-5`}>
      <h2 className="mb-4 font-black">구독 관리</h2>
      {subscriptions.length === 0 && <p className="text-sm text-muted">구독 중인 크리에이터가 없어요.</p>}
      <div className="grid gap-2">
        {subscriptions.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-canvas p-3">
            <button
              className="flex items-center gap-2 text-sm font-bold hover:text-accent"
              onClick={() => openCreator(c.id)}
            >
              <Avatar person={c} account={accounts[c.id]} className="size-8" />
              {c.name}
            </button>
            <Button tone="plain" onClick={() => onUnsubscribe(c)}>
              구독 해지
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
