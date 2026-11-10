import Avatar from '../../../../shared/components/ui/Avatar'
import Badge from '../../../../shared/components/ui/Badge'
import Button from '../../../../shared/components/ui/Button'
import type { Account } from '../../../../shared/types/account'
import { formatKrw, formatNumber } from '../../../../shared/utils/format'
import type { SettlementRow } from '../types/settlementReport'

export default function SettlementCreatorRow({
  row,
  account,
  onEdit,
}: {
  row: SettlementRow
  account?: Account
  onEdit: (row: SettlementRow) => void
}) {
  return (
    <tr className="border-t border-edge hover:bg-white/3 [&>td]:px-3 [&>td]:py-2.5">
      <th scope="row" className="px-3 py-2.5 text-left">
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Avatar person={row.creator} account={account} className="size-7" />
          {row.creator.name}
        </span>
      </th>
      <td>{formatNumber(row.coins)}</td>
      <td>{formatKrw(row.actualGross)}</td>
      <td>{formatKrw(row.subs)}</td>
      <td>
        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          <span>{formatNumber(row.appliedCoins)}</span>
          {row.adjusted !== undefined && <Badge>수동</Badge>}
          <Button
            tone="plain"
            className="min-h-8 px-2 py-1 text-xs"
            aria-label={row.creator.name + ' 정산 코인 직접 입력'}
            onClick={() => onEdit(row)}
          >
            직접 입력
          </Button>
        </div>
      </td>
      <td>{formatKrw(row.net)}</td>
      <td>{formatKrw(row.fee)}</td>
      <td className="font-bold text-mint">{formatKrw(row.due)}</td>
    </tr>
  )
}
