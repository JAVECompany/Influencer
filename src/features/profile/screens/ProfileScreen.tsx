import { Bell, CreditCard, KeyRound, LogOut, UserRound } from 'lucide-react'
import ShippingOrderList from '../../../shared/components/products/ShippingOrderList'
import Avatar from '../../../shared/components/ui/media/Avatar'
import Badge from '../../../shared/components/ui/display/Badge'
import Button from '../../../shared/components/ui/actions/Button'
import ConfirmActionDialog from '../../../shared/components/ui/dialogs/ConfirmActionDialog'
import PageTitle from '../../../shared/components/ui/layout/PageTitle'
import { roles } from '../../../shared/constants/roles'
import { panel } from '../../../shared/styles/controlStyles'
import type { IPageProps } from '../../../shared/types/navigation'
import ChangePasswordDialog from '../components/ChangePasswordDialog'
import EditProfileDialog from '../components/EditProfileDialog'
import PaymentSettingsDialog from '../components/PaymentSettingsDialog'
import ProfileSubscriptions from '../components/ProfileSubscriptions'
import ThemeSetting from '../components/ThemeSetting'
import { useProfile } from '../hooks/useProfile'

export default function ProfileScreen({
  account,
  notify,
  openCreator,
}: Pick<IPageProps, 'account' | 'notify' | 'openCreator'>) {
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
      <PageTitle title="프로필" />
      <section className={`${panel} mb-5 flex flex-wrap items-center gap-4 p-5`}>
        <Avatar account={account} person={creator} className="size-[72px] text-xl" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black break-words">{account.name}</h2>
          <p className="mt-1 text-xs text-muted">{account.id}</p>
        </div>
        <Badge>{roles[account.role]}</Badge>
      </section>
      <section className={`${panel} mb-5 divide-y divide-line`}>
        <ThemeSetting />
        <button
          className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-accent"
          onClick={() => setDialog('profile')}
        >
          <UserRound size={18} className="text-muted" aria-hidden="true" /> 프로필 수정
        </button>
        <button
          className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-accent"
          onClick={() => setDialog('password')}
        >
          <KeyRound size={18} className="text-muted" aria-hidden="true" /> 비밀번호 변경
        </button>
        {account.role !== 'admin' && (
          <button
            className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-accent"
            onClick={() => setDialog('payment')}
          >
            <CreditCard size={18} className="text-muted" aria-hidden="true" />
            {account.role === 'customer' ? '결제 수단' : '정산 수단'}
            <span className="ml-auto text-xs text-muted">{account.payment || '미등록'}</span>
          </button>
        )}
        <button
          role="switch"
          aria-checked={account.notifications}
          className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold hover:text-accent"
          onClick={toggleNotifications}
        >
          <Bell size={18} className="text-muted" aria-hidden="true" /> 알림
          <span
            aria-hidden="true"
            className={`ml-auto flex h-6 w-11 items-center rounded-full p-0.5 ${
              account.notifications ? 'justify-end bg-accent' : 'justify-start bg-line'
            }`}
          >
            <span className={`size-5 rounded-full ${account.notifications ? 'bg-on-accent' : 'bg-muted'}`} />
          </span>
        </button>
      </section>
      {account.role === 'customer' && (
        <>
          <ProfileSubscriptions
            subscriptions={subs}
            accounts={accounts}
            openCreator={openCreator}
            onUnsubscribe={setDialog}
          />
          <ShippingOrderList account={account} notify={notify} />
        </>
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
