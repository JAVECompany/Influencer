import { Coins } from 'lucide-react'
import BrandLogo from '../../shared/components/ui/branding/BrandLogo'
import type { IAccount } from '../../shared/types/account'
import { formatNumber } from '../../shared/utils/format/format'

export default function WorkspaceHeader({
  account,
  title,
  balance,
  onHome,
  onStore,
}: {
  account: IAccount
  title?: string
  balance: number
  onHome: () => void
  onStore: () => void
}) {
  return (
    <header className="theme-chrome sticky top-0 z-20 border-b border-line/75 bg-shell">
      <div className="mx-auto flex h-[68px] max-w-[1130px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
        <button type="button" className="text-left lg:hidden" onClick={onHome}>
          <BrandLogo />
        </button>
        <p className="hidden text-sm font-semibold text-muted lg:block">{title}</p>
        {account.role === 'customer' && (
          <button
            type="button"
            onClick={onStore}
            aria-label={`보유 코인 ${formatNumber(balance)}개 · 스토어`}
            className="ml-auto flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-bold tabular-nums hover:border-accent"
          >
            <Coins size={15} className="text-muted" aria-hidden="true" />
            {formatNumber(balance)}
          </button>
        )}
      </div>
    </header>
  )
}
