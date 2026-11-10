import { Coins } from 'lucide-react'
import BrandLogo from '../../shared/components/ui/BrandLogo'
import { roles } from '../../shared/constants/roles'
import type { Account } from '../../shared/types/account'
import { formatNumber } from '../../shared/utils/format'

export default function WorkspaceHeader({
  account,
  title,
  balance,
  onHome,
  onStore,
}: {
  account: Account
  title?: string
  balance: number
  onHome: () => void
  onStore: () => void
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-edge/75 bg-night/92 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1130px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
        <button type="button" className="text-left lg:hidden" onClick={onHome}>
          <BrandLogo />
        </button>
        <p className="hidden text-xs font-bold tracking-[.16em] text-dim lg:block">
          {roles[account.role]} <span className="px-1 text-edge">/</span> {title}
        </p>
        <div className="flex min-w-0 items-center gap-2.5">
          {account.role === 'customer' && (
            <button
              type="button"
              onClick={onStore}
              className="flex items-center gap-1.5 rounded-full border border-edge px-2.5 py-1.5 text-xs font-bold text-mint hover:border-mint"
            >
              <Coins size={14} />
              {formatNumber(balance)} <span className="hidden sm:inline">코인</span>
            </button>
          )}
          <span className="truncate rounded-full bg-panel px-2.5 py-1.5 text-[10px] font-bold text-dim">
            DEMO · {roles[account.role]}
          </span>
        </div>
      </div>
    </header>
  )
}
