import type { ITransaction } from '../../../../shared/types/commerce'
import type { IAppData } from '../../../../shared/types/demoState'

const DAY = 86_400_000

const KST = 9 * 3_600_000

export const periodOptions = [
  ['day', '1일'],
  ['week', '1주일'],
  ['month', '한 달'],
  ['half', '6개월'],
  ['year', '1년'],
  ['custom', '직접 선택'],
] as const

export type PeriodModeType = (typeof periodOptions)[number][0]

interface ISettlementPeriod {
  start: string
  end: string
  key: string
}

export const formatDateInKorea = (time: number) => new Date(time + KST).toISOString().slice(0, 10)

const getMonthStart = (date: Date, monthsBack: number) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - monthsBack, 1)).toISOString().slice(0, 10)

export function getSettlementPeriod(
  mode: PeriodModeType,
  customStart: string,
  customEnd: string,
  now = Date.now()
): ISettlementPeriod | null {
  const today = formatDateInKorea(now)
  const month = new Date(now + KST)
  const starts = {
    day: today,
    week: formatDateInKorea(now - 6 * DAY),
    month: getMonthStart(month, 0),
    half: getMonthStart(month, 5),
    year: getMonthStart(month, 11),
  }
  const start = mode === 'custom' ? customStart : starts[mode]
  const end =
    mode === 'custom'
      ? customEnd
      : mode === 'month'
      ? new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).toISOString().slice(0, 10)
      : today
  if (!start || !end || start > end || (mode === 'custom' && end > today)) {
    return null
  }

  return { start, end, key: start + '/' + end }
}

function calculateCoinSplit(coins: number, coinWon: number, feeBps: number) {
  const gross = coins * coinWon
  const fee = Math.round((gross * feeBps) / 10_000)
  return { gross, fee, net: gross - fee }
}

export function summarizeSettlement(
  state: Pick<IAppData, 'accounts' | 'creators' | 'settlement' | 'transactions'>,
  period: ISettlementPeriod
) {
  const items: ITransaction[] = []
  const totals = new Map<string, { coins: number; subs: number }>()
  const monthly = new Map<string, number>()
  const { coinWon, feeBps, overrides } = state.settlement
  const manual = overrides[period.key] ?? {}
  for (const transaction of state.transactions) {
    if (state.accounts[transaction.customer]?.role === 'admin') {
      continue
    }

    const date = formatDateInKorea(transaction.at)
    if (date < period.start || date > period.end) {
      continue
    }

    items.push(transaction)
    const { owner, type, coins = 0, won = 0 } = transaction
    if (!owner || !state.creators[owner]) {
      continue
    }

    const total = totals.get(owner) ?? { coins: 0, subs: 0 }
    if (type === 'product' || type === 'roulette') {
      total.coins += coins
    }
    if (type === 'subscribe') {
      total.subs += won
      const month = date.slice(0, 7)
      monthly.set(month, (monthly.get(month) ?? 0) + won)
    }
    totals.set(owner, total)
  }
  const rows = Object.values(state.creators)
    .filter(
      (creator) =>
        creator.status === 'approved' || totals.has(creator.id) || Object.hasOwn(manual, creator.id)
    )
    .map((creator) => {
      const { coins = 0, subs = 0 } = totals.get(creator.id) ?? {}
      const adjusted = manual[creator.id]
      const appliedCoins = adjusted ?? coins
      const split = calculateCoinSplit(appliedCoins, coinWon, feeBps)
      return {
        creator,
        coins,
        appliedCoins,
        adjusted,
        subs,
        actualGross: coins * coinWon,
        ...split,
        due: subs + split.net,
      }
    })
    .sort((a, b) => b.due - a.due || a.creator.name.localeCompare(b.creator.name, 'ko'))
  const total = rows.reduce(
    (sum, row) => ({
      coins: sum.coins + row.coins,
      actualGross: sum.actualGross + row.actualGross,
      subs: sum.subs + row.subs,
      gross: sum.gross + row.gross,
      fee: sum.fee + row.fee,
      net: sum.net + row.net,
      due: sum.due + row.due,
    }),
    { coins: 0, actualGross: 0, subs: 0, gross: 0, fee: 0, net: 0, due: 0 }
  )
  return { rows, total, monthly: [...monthly].sort(([a], [b]) => b.localeCompare(a)), items }
}
