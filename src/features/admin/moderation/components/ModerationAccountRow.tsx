import Avatar from '../../../../shared/components/ui/media/Avatar'
import Button from '../../../../shared/components/ui/actions/Button'
import { roles } from '../../../../shared/constants/roles'
import type { Account, Creator } from '../../../../shared/types/account'

export default function ModerationAccountRow({
  account,
  creator,
  disabled,
  onToggle,
}: {
  account?: Account
  creator?: Creator
  disabled: boolean
  onToggle: () => void
}) {
  const role = account?.role ?? 'influencer'
  return (
    <div className="flex items-center gap-3 p-4">
      <Avatar account={account} person={creator} className="size-10" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{creator?.name ?? account?.name}</p>
        <p className="mt-1 text-xs text-muted">
          {roles[role]} · {disabled ? '정지' : '이용 중'}
          {creator && ` · @${creator.handle}`}
        </p>
      </div>
      {role !== 'admin' && (
        <Button tone={disabled ? 'subtle' : 'danger'} onClick={onToggle}>
          {disabled ? '복구' : '이용 정지'}
        </Button>
      )}
    </div>
  )
}
