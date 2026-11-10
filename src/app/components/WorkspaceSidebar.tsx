import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import Avatar from '../../shared/components/ui/Avatar'
import BrandLogo from '../../shared/components/ui/BrandLogo'
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
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[220px] flex-col border-r border-edge/75 bg-[#0e151d] px-4 py-6 lg:flex">
      <button type="button" className="mb-10 px-2 text-left" onClick={onHome}>
        <BrandLogo />
      </button>
      <p className="mb-3 px-3 text-[10px] font-bold tracking-[.16em] text-dim">
        {account.role === 'customer' ? '나의 궤도' : roles[account.role] + ' 워크스페이스'}
      </p>
      <nav aria-label="주 메뉴" className="grid gap-1.5">
        {navButtons}
      </nav>
      <div className="mt-auto rounded-xl border border-edge p-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar person={creator} account={account} className="size-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-black">{account.name}</p>
            <p className="mt-0.5 text-[10px] text-dim">{roles[account.role]}</p>
          </div>
          <button
            type="button"
            aria-label="로그아웃"
            className="rounded-lg p-1.5 text-dim hover:bg-white/5 hover:text-white"
            onClick={onSignOut}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      <p className="mt-3 px-1 text-[10px] text-dim">BAMGYEOL · 프론트엔드 데모</p>
    </aside>
  )
}
