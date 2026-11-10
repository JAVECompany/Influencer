import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAccountStore } from '../../../../shared/store/account/account'
import { useCreatorStore } from '../../../../shared/store/creator/creator'
import { useSettlementStore } from '../../../../shared/store/settlement/settlement'
import { useWalletStore } from '../../../../shared/store/wallet/wallet'
import type { IPageProps } from '../../../../shared/types/navigation'
import type { SettlementRowType } from '../types/settlementReport'
import { formatDateInKorea, getSettlementPeriod, summarizeSettlement } from '../utils/settlement'
import type { PeriodModeType } from '../utils/settlement'

export function useAdminSettlement(notify: IPageProps['notify']) {
  const accounts = useAccountStore((s) => s.accounts)
  const creators = useCreatorStore((s) => s.creators)
  const settlement = useSettlementStore((s) => s.settlement)
  const transactions = useWalletStore((s) => s.transactions)
  const state = { accounts, creators, settlement, transactions }
  const { configureSettlement, overrideSettlementCoins } = useSettlementStore(
    useShallow(({ configureSettlement, overrideSettlementCoins }) => ({
      configureSettlement,
      overrideSettlementCoins,
    }))
  )
  const [mode, setMode] = useState<PeriodModeType>('month')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [query, setQuery] = useState('')
  const [edit, setEdit] = useState<SettlementRowType | null>(null)
  const [historyLimit, setHistoryLimit] = useState(12)
  const now = Date.now()
  const today = formatDateInKorea(now)
  const month = getSettlementPeriod('month', '', '', now)
  const period = getSettlementPeriod(mode, start, end, now)
  if (!month) {
    return null
  }

  const current = summarizeSettlement(state, month)
  const report = period && (period.key === month.key ? current : summarizeSettlement(state, period))
  const { coinWon, feeBps } = state.settlement
  const term = query.trim().toLowerCase().replace(/^@/, '')
  const rows =
    report?.rows.filter(
      ({ creator }) =>
        creator.name.toLowerCase().includes(term) || creator.handle.toLowerCase().includes(term)
    ) ?? []
  const editCoins = (coins: number | null) => {
    if (!period || !edit) {
      return
    }

    const result = overrideSettlementCoins(period.key, edit.creator.id, coins)
    notify(
      result,
      coins === null ? '거래 내역의 코인 수로 복원했어요.' : '선택 기간의 정산 코인 수를 설정했어요.'
    )
    if (!result.error) {
      setEdit(null)
    }
  }

  const changeMode = (next: PeriodModeType) => {
    setMode(next)
    setHistoryLimit(12)
  }
  const changeStart = (next: string) => {
    setStart(next)
    setHistoryLimit(12)
  }
  const changeEnd = (next: string) => {
    setEnd(next)
    setHistoryLimit(12)
  }
  const loadMore = () => setHistoryLimit(historyLimit + 20)
  const saveConfig = (unit: number, fee: number) =>
    notify(configureSettlement(unit, Math.round(fee * 100)), '코인 정산 기준을 저장했어요.')

  return {
    accounts: state.accounts,
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
  }
}
