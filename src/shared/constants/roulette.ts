import type { Reward } from '../types/commerce'

export const defaultRouletteRewards: Reward[] = [
  { name: '식사 데이트권', chance: 6 },
  { name: '영상 통화권', chance: 12 },
  { name: '원하는 포즈 사진', chance: 18 },
  { name: '미공개 셀카', chance: 24 },
  { name: '다음 기회에 · 일상 사진', chance: 40 },
]

export const rouletteSegmentColors = [
  '#66e8c4',
  '#6189b4',
  '#d7ae73',
  '#8b8fc4',
  '#62a497',
  '#b88495',
  '#7aa1bb',
  '#96b179',
]
