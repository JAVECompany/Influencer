import { useState } from 'react'
import CreatorDetailScreen from '../../features/creator-detail/screens/CreatorDetailScreen'
import { useAuthStore } from '../../shared/store/auth/auth'
import { useCreatorStore } from '../../shared/store/creator/creator'
import { useWalletStore } from '../../shared/store/wallet/wallet'
import type { PageKey, PageProps } from '../../shared/types/navigation'
import { applicationNav, navItems, pages } from '../navigation/workspaceNavigation'
import WorkspaceHeader from './WorkspaceHeader'
import WorkspaceSidebar from './WorkspaceSidebar'

export default function WorkspaceLayout({ account, notify }: Pick<PageProps, 'account' | 'notify'>) {
  const creator = useCreatorStore((state) => state.creators[account.id])
  const balance = useWalletStore((state) => state.balances[account.id] ?? 0)
  const signOut = useAuthStore((state) => state.signOut)
  const nav =
    account.role === 'influencer' && creator?.status !== 'approved' ? applicationNav : navItems[account.role]
  const [tab, setTab] = useState(nav[0][0])
  const [detail, setDetail] = useState<string | null>(null)
  const [chat, setChat] = useState<string | null>(null)
  const current = nav.some(([id]) => id === tab) ? tab : nav[0][0]
  const Page = pages[current]
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' })
  const go = (id: PageKey) => {
    setTab(id)
    setDetail(null)
    setChat(null)
    scrollTop()
  }
  const openCreator = (id: string) => {
    setDetail(id)
    scrollTop()
  }
  const openChat = (id: string) => {
    setDetail(null)
    setTab('chat')
    setChat(id)
    scrollTop()
  }
  const navButtons = nav.map(([id, title, Icon]) => (
    <button
      key={id}
      type="button"
      aria-current={current === id ? 'page' : undefined}
      onClick={() => go(id)}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-[10px] font-bold transition sm:text-xs lg:w-full lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:px-3.5 lg:py-3 lg:text-sm ${
        current === id
          ? 'bg-accent-soft text-accent'
          : 'text-muted hover:bg-foreground/5 hover:text-foreground'
      }`}
    >
      <Icon size={20} strokeWidth={current === id ? 2.5 : 1.85} aria-hidden="true" />
      <span className="truncate">{title}</span>
    </button>
  ))
  return (
    <div className="min-h-dvh">
      <WorkspaceSidebar
        account={account}
        creator={creator}
        navButtons={navButtons}
        onHome={() => go(nav[0][0])}
        onSignOut={signOut}
      />
      <div className="lg:ml-[220px]">
        <WorkspaceHeader
          account={account}
          title={detail ? '크리에이터' : nav.find(([id]) => id === current)?.[1]}
          balance={balance}
          onHome={() => go(nav[0][0])}
          onStore={() => go('store')}
        />
        <main className="mx-auto w-full max-w-[1130px] px-4 pt-6 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:px-7 sm:pt-8 lg:px-10 lg:pb-12">
          {detail && ['customer', 'admin'].includes(account.role) ? (
            <CreatorDetailScreen
              key={detail}
              id={detail}
              account={account}
              back={() => {
                setDetail(null)
                scrollTop()
              }}
              {...{ openCreator, openChat, notify }}
            />
          ) : (
            <Page
              key={current + (chat ?? '')}
              {...{ account, openCreator, openChat, go, notify }}
              initial={chat}
            />
          )}
        </main>
      </div>
      <nav
        aria-label="모바일 주 메뉴"
        className="theme-chrome fixed inset-x-0 bottom-0 z-30 flex gap-1 border-t border-line bg-shell px-2 pt-1.5 pb-[calc(.4rem+env(safe-area-inset-bottom))] lg:hidden"
      >
        {navButtons}
      </nav>
    </div>
  )
}
