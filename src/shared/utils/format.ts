export const formatKrw = (value: number) => '₩' + value.toLocaleString('ko-KR')

export const formatNumber = (value: number) => value.toLocaleString('ko-KR')

export function formatRelativeTime(time: number) {
  const minutes = Math.max(1, Math.floor((Date.now() - time) / 60_000))
  if (minutes < 60) return minutes + '분 전'
  if (minutes < 1440) return Math.floor(minutes / 60) + '시간 전'
  return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(time)
}
