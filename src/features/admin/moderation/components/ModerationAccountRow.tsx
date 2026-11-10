import Avatar from '../../../../shared/components/ui/Avatar'
import Button from '../../../../shared/components/ui/Button'
import { roles } from '../../../../shared/constants/roles'
import type { Account, Creator } from '../../../../shared/types/account'

export default function ModerationAccountRow({
  account,
  creator,
  onToggle,
}: {
  account: Account
  creator?: Creator
  onToggle: (account: Account) => void
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Avatar account={account} person={creator} className="size-10" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{account.name}</p>
        <p className="mt-1 text-xs text-dim">
          {roles[account.role]} · {account.disabled ? '정지' : '이용 중'}
        </p>
      </div>
      {account.role !== 'admin' && (
        <Button tone={account.disabled ? 'subtle' : 'danger'} onClick={() => onToggle(account)}>
          {account.disabled ? '복구' : '이용 정지'}
        </Button>
      )}
    </div>
  )
}
