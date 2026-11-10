import type { summarizeSettlement } from '../utils/settlement'

export type SettlementReportType = ReturnType<typeof summarizeSettlement>
export type SettlementRowType = SettlementReportType['rows'][number]
