import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import Avatar from '../../shared/components/ui/media/Avatar'
import BrandLogo from '../../shared/components/ui/branding/BrandLogo'
import { roles } from '../../shared/constants/roles'
import type { Account, Creator } from '../../shared/types/account'

export default function WorkspaceSidebar({
  account,
  creator,
  navButtons,
  onHome,
  onSignOut,
}: {
  account: Account
  creator?: Creator
  navButtons: ReactNode
  onHome: () => void
  onSignOut: () => void
}) {
  return (
    <aside className="theme-chrome fixed inset-y-0 left-0 z-20 hidden w-[220px] flex-col border-r border-line/75 bg-shell px-4 py-6 lg:flex">
      <button type="button" className="mb-8 px-2 text-left" onClick={onHome}>
        <BrandLogo />
      </button>
      <nav aria-label="주 메뉴" className="grid gap-1.5">
        {navButtons}
      </nav>
      <div className="mt-auto rounded-xl border border-line p-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar person={creator} account={account} className="size-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-black">{account.name}</p>
            <p className="mt-0.5 text-[10px] text-muted">{roles[account.role]}</p>
          </div>
          <button
            type="button"
            aria-label="로그아웃"
            className="rounded-lg p-1.5 text-muted hover:bg-foreground/5 hover:text-foreground"
            onClick={onSignOut}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
