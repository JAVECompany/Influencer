import TransactionLedger from '../../../../shared/components/transactions/TransactionLedger'
import Button from '../../../../shared/components/ui/actions/Button'
import PageTitle from '../../../../shared/components/ui/layout/PageTitle'
import type { PageProps } from '../../../../shared/types/navigation'
import SettlementConfigForm from '../components/SettlementConfigForm'
import SettlementCreatorTable from '../components/SettlementCreatorTable'
import SettlementMonthlyRevenue from '../components/SettlementMonthlyRevenue'
import SettlementOverrideDialog from '../components/SettlementOverrideDialog'
import SettlementPeriodFilter from '../components/SettlementPeriodFilter'
import SettlementSummary from '../components/SettlementSummary'
import { useAdminSettlement } from '../hooks/useAdminSettlement'

export default function AdminSettlementScreen({ notify }: Pick<PageProps, 'notify'>) {
  const settlement = useAdminSettlement(notify)
  if (!settlement) {
    return null
  }

  const {
    accounts,
    mode,
    start,
    end,
    query,
    setQuery,
    edit,
    setEdit,
    historyLimit,
    loadMore,
    today,
    month,
    period,
    current,
    report,
    coinWon,
    feeBps,
    rows,
    editCoins,
    changeMode,
    changeStart,
    changeEnd,
    saveConfig,
  } = settlement

  return (
    <>
      <PageTitle title="거래 · 정산" subtitle="고객의 데모 거래를 집계하고 코인 정산 기준을 적용합니다." />
      <SettlementSummary month={month.start.slice(0, 7)} total={current.total} />

      <SettlementPeriodFilter
        mode={mode}
        start={start}
        end={end}
        today={today}
        period={period}
        onModeChange={changeMode}
        onStartChange={changeStart}
        onEndChange={changeEnd}
      />

      <SettlementConfigForm coinWon={coinWon} feeBps={feeBps} onSave={saveConfig} />

      {report && (
        <>
          <SettlementCreatorTable
            rows={rows}
            total={report.total}
            accounts={accounts}
            query={query}
            onQueryChange={setQuery}
            onEdit={setEdit}
          />
          <SettlementMonthlyRevenue monthly={report.monthly} />
          <TransactionLedger
            title="선택 기간 거래 내역"
            items={report.items.slice(0, historyLimit)}
            showParties
            absoluteDates
          />
          {historyLimit < report.items.length && (
            <Button tone="subtle" className="mt-3" onClick={loadMore}>
              거래 더 보기
            </Button>
          )}
        </>
      )}
      {edit && period && (
        <SettlementOverrideDialog
          row={edit}
          start={period.start}
          end={period.end}
          onSave={editCoins}
          onClose={() => setEdit(null)}
        />
      )}
    </>
  )
}
