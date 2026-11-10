import type { summarizeSettlement } from '../utils/settlement'

export type SettlementReport = ReturnType<typeof summarizeSettlement>
export type SettlementRow = SettlementReport['rows'][number]
