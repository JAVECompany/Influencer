import { Bell, CreditCard, KeyRound, LogOut, UserRound } from 'lucide-react'
import Avatar from '../../../shared/components/ui/Avatar'
import Badge from '../../../shared/components/ui/Badge'
import Button from '../../../shared/components/ui/Button'
import ConfirmActionDialog from '../../../shared/components/ui/ConfirmActionDialog'
import PageTitle from '../../../shared/components/ui/PageTitle'
import { roles } from '../../../shared/constants/roles'
import { panel } from '../../../shared/styles/controlStyles'
import type { PageProps } from '../../../shared/types/navigation'
import ChangePasswordDialog from '../components/ChangePasswordDialog'
import EditProfileDialog from '../components/EditProfileDialog'
import PaymentSettingsDialog from '../components/PaymentSettingsDialog'
import ProfileSubscriptions from '../components/ProfileSubscriptions'
import { useProfile } from '../hooks/useProfile'

export default function ProfileScreen({
  account,
  notify,
  openCreator,
}: Pick<PageProps, 'account' | 'notify' | 'openCreator'>) {
  const {
    accounts,
    creator,
    subs,
    dialog,
    setDialog,
    closeDialog,
    save,
    toggleNotifications,
    unsubscribe,
    signOut,
  } = useProfile({ account, notify })

  return (
    <>
      <PageTitle label="MY ACCOUNT" title="프로필" subtitle="내 계정과 이용 환경을 관리하세요." />
      <section className={`${panel} mb-5 flex flex-wrap items-center gap-4 p-5`}>
        <Avatar account={account} person={creator} className="size-[72px] text-xl" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black break-words">{account.name}</h2>
          <p className="mt-1 text-xs text-dim">{account.id}</p>
        </div>
        <Badge>{roles[account.role]}</Badge>
      </section>
      <section className={`${panel} mb-5 divide-y divide-edge`}>
        <button
          className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-mint"
          onClick={() => setDialog('profile')}
        >
          <UserRound size={18} className="text-mint" /> 프로필 이미지 · 닉네임
        </button>
        <button
          className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-mint"
          onClick={() => setDialog('password')}
        >
          <KeyRound size={18} className="text-mint" /> 비밀번호 변경
        </button>
        {account.role !== 'admin' && (
          <button
            className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-mint"
            onClick={() => setDialog('payment')}
          >
            <CreditCard size={18} className="text-mint" />{' '}
            {account.role === 'customer' ? '결제 계좌 · 수단' : '정산 수단'}{' '}
            <span className="ml-auto text-xs text-dim">{account.payment || '미등록'}</span>
          </button>
        )}
        <button
          role="switch"
          aria-checked={account.notifications}
          className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-mint"
          onClick={toggleNotifications}
        >
          <Bell size={18} className="text-mint" /> 전체 알림{' '}
          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs ${
              account.notifications ? 'bg-mint text-night' : 'bg-edge text-dim'
            }`}
          >
            {account.notifications ? 'ON' : 'OFF'}
          </span>
        </button>
      </section>
      {account.role === 'customer' && (
        <ProfileSubscriptions
          subscriptions={subs}
          accounts={accounts}
          openCreator={openCreator}
          onUnsubscribe={setDialog}
        />
      )}
      <Button tone="subtle" onClick={signOut}>
        <LogOut size={16} /> 로그아웃
      </Button>
      {dialog === 'profile' && (
        <EditProfileDialog account={account} save={save} notify={notify} onClose={closeDialog} />
      )}
      {dialog === 'password' && <ChangePasswordDialog save={save} notify={notify} onClose={closeDialog} />}
      {dialog === 'payment' && <PaymentSettingsDialog account={account} save={save} onClose={closeDialog} />}
      {dialog && typeof dialog === 'object' && (
        <ConfirmActionDialog
          title="구독 해지"
          description={dialog.name + ' 구독을 해지하면 전용 콘텐츠와 채팅 이용이 종료돼요.'}
          actionLabel="구독 해지"
          onConfirm={() => unsubscribe(dialog.id)}
          onClose={closeDialog}
        />
      )}
    </>
  )
}
