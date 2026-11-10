import type { Creator } from '../types/account'
import type { Transaction } from '../types/commerce'
import type { Content, ContentKind } from '../types/content'

const women =
  '은서 지유 수아 예린 서아 채원 유진 소민 혜원 예나 서연 민서 하윤 다은 나린 유라 지아 가은 채영 은지 수현 소연 다현 세아 윤서 지민 지수 하은 연우 나현 아린 유빈 유리 다인 은채 서희 서정 보라 소정 여름 봄이 가을 겨울 은별 나래 아라 별하 라희 하린 태리 채린 예빈 이서 연서 시은 현아 규리 채은 재이 로아 희주 선아 세린 은하'.split(
    ' '
  )

const men =
  '준호 현우 시우 민준 건우 지훈 도윤 성민 민재 유준 주원 하준 정우 태윤 이든 준서 우진 태오 진우 태현 서준 민혁 성준 지호 승우 동현 해준'.split(
    ' '
  )

const themes = [
  ['낯선 골목에서 수집한 장면', '걸음을 멈추고 한참 바라봤던 풍경을 기록합니다.'],
  ['오늘의 작업실', '새로운 작업을 준비하면서 남긴 작은 기록을 공유해요.'],
  ['빛이 좋은 오후', '산책하며 만난 장면을 차분히 모았습니다.'],
  ['하루의 기록', '요즘 즐겨 듣는 음악과 일상의 조각들을 나눠요.'],
  ['천천히 보는 풍경', '지난 주말 가장 오래 기억에 남은 순간입니다.'],
]

export const addedRoster = [...women, ...men].map((name, i): Creator => {
  const serial = String(i + 1).padStart(3, '0')
  const female = i < women.length
  const rank = (i * 37) % (women.length + men.length)
  return {
    id: 'demo-creator-' + serial,
    handle: 'orbit_' + serial,
    name,
    gender: female ? 'female' : 'male',
    portrait: female ? i + 6 : i - women.length + 73,
    fans: 12 + Math.round(6200 * (1 - rank / 92) ** 3),
    price: [3900, 4900, 5900, 6900, 7900, 8900][i % 6],
    bio: themes[i % themes.length][1],
    art: i % 9,
    status: 'approved',
    instagram: '',
    email: '',
    reason: '',
  }
})

const applicationFixtures = [
  {
    id: 'demo-request-dabin',
    name: '다빈',
    handle: 'dabin_orbit',
    bio: '카페와 여행을 필름으로 기록합니다.',
    method: 'direct',
    email: 'dabin@example.test',
  },
  {
    id: 'demo-request-geon',
    name: '건',
    handle: 'geon_daily',
    bio: '산책과 러닝 기록.',
    method: 'link',
    instagram: 'https://www.instagram.com/geon_daily/',
  },
  {
    id: 'demo-request-sera',
    name: '세라',
    handle: 'sera_journal',
    bio: '일상에서 찾은 디자인 이야기.',
    method: 'direct',
    email: 'sera@example.test',
  },
  {
    id: 'demo-request-haon',
    name: '하온',
    handle: 'haon_archive',
    bio: '공연과 음악의 기록.',
    method: 'direct',
    email: 'haon@example.test',
  },
] satisfies Pick<Creator, 'id' | 'name' | 'handle' | 'bio' | 'method' | 'instagram' | 'email'>[]

export const mockApplicants = applicationFixtures.map(
  (creator, i): Creator => ({ price: 5900, fans: 0, reason: '', art: i + 1, status: 'pending', ...creator })
)

export function mockPosts(now: number): Content[] {
  return addedRoster.flatMap((creator, i) => {
    const [title, body] = themes[i % themes.length]
    const entry = (kind: ContentKind, minutes: number): Content => ({
      id: creator.id + '-' + kind,
      owner: creator.id,
      kind,
      title,
      body,
      art: creator.art,
      at: now - minutes * 60_000,
      hidden: false,
      likes: [],
      reports: [],
    })
    const items = [entry('post', 90 + i * 41)]
    if (i % 13 === 0) items.push(entry(i % 2 ? 'story' : 'live', 20 + i))
    return items
  })
}

export function mockTransactions(now: number, roster: Creator[]): Transaction[] {
  const time = new Date(now + 9 * 3_600_000)
  const year = time.getUTCFullYear()
  const month = time.getUTCMonth()
  const yesterday = now - 86_400_000
  const sampleDates = [
    now,
    yesterday,
    now - 4 * 86_400_000,
    ...Array.from({ length: 11 }, (_, i) => Date.UTC(year, month - i - 1, 15, 3)),
  ]
  return sampleDates
    .flatMap((at, period) =>
      roster.flatMap((creator, i) => {
        const id = 'demo-ledger-' + period + '-' + i
        const data = { customer: 'demo-fan-' + (i + 1), owner: creator.id, at }
        const items: Transaction[] = [
          { ...data, id, type: i % 2 ? 'roulette' : 'product', coins: 25 + ((period * 31 + i * 17) % 230) },
        ]
        if (i < 9 || (i + period) % 3 !== 0)
          items.push({ ...data, id: id + '-sub', type: 'subscribe', won: creator.price })
        return items
      })
    )
    .sort((a, b) => b.at - a.at)
}
