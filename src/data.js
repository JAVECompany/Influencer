import { addedRoster, mockApplicants, mockPosts, mockTransactions } from './demo-data'

export const roles = {
  admin: '관리자',
  influencer: '인플루언서',
  customer: '고객',
}

export const demos = [
  { id: 'user123', role: 'customer', name: '나의 궤도' },
  { id: 'influencer123', role: 'influencer', name: '서린' },
  { id: 'admin123', role: 'admin', name: '밤결 운영팀' },
]

const roster = [
  ['influencer123', '서린', 'seorin', '도시의 밤과 조용한 일상.', 3480, 7900, 0],
  ['doha', '도하', 'doha', '매일의 사운드와 스튜디오 비하인드.', 2120, 5900, 1],
  ['yuna', '윤아', 'yuna', '여행 끝에 남은 장면들을 모아요.', 4160, 8900, 2],
  ['mina', '미나', 'mina', '하루에 한 장의 필름 사진.', 910, 4900, 3],
  ['noel', '노을', 'noel', '한적한 새벽, 천천히 남기는 기록.', 1450, 6900, 4],
  ['ian', '이안', 'ian', '작업실에서 보내는 편지.', 730, 3900, 5],
  ['haru', '하루', 'haru', '낯선 도시를 걸으며 만난 풍경.', 2630, 6900, 6],
  ['jian', '지안', 'jian', '커피, 음악, 그리고 나만의 시간.', 520, 4900, 7],
  ['sol', '솔', 'sol', '조금 느리게 바라본 일상.', 1100, 5900, 8],
]
const originalPortraits = [0, 70, 1, 2, 71, 72, 3, 4, 5]
const approvedRoster = [
  ...roster.map(([id, name, handle, bio, fans, price, art], i) => ({
    id, name, handle, bio, fans, price, art, status: 'approved', instagram: '', email: '', reason: '',
    portrait: originalPortraits[i], gender: originalPortraits[i] < 70 ? 'female' : 'male',
  })),
  ...addedRoster,
]

export const palettes = [
  ['#557e83', '#152735', '#d3a18d', '#162022'],
  ['#927454', '#232d37', '#d9a889', '#211a16'],
  ['#7c6e99', '#22263f', '#ebbaa6', '#2c1926'],
  ['#ad775e', '#3e2e3b', '#dcab99', '#231e2b'],
  ['#54738a', '#242b44', '#e4ba9a', '#202638'],
  ['#8b8567', '#323a30', '#c89b80', '#252420'],
  ['#486b8c', '#17283f', '#ebbc9d', '#231e27'],
  ['#8a6379', '#292235', '#dfb097', '#311d23'],
  ['#4f806a', '#203b37', '#c59980', '#192c27'],
]

const ago = (minutes) => Date.now() - minutes * 60_000
const content = (id, owner, kind, title, body, art, minutes) =>
  ({ id, owner, kind, title, body, art, at: ago(minutes), hidden: false, likes: [], reports: [] })

export const initialData = {
  accounts: Object.fromEntries(demos.map((demo) => [
    demo.id, { ...demo, password: demo.id, avatar: '', notifications: true, payment: '', disabled: false },
  ])),
  creators: Object.fromEntries([...approvedRoster, ...mockApplicants].map((creator) => [creator.id, creator])),
  posts: [
    content('p1', 'influencer123', 'post', '도시가 잠든 뒤', '밤이 깊을수록 보이는 것들이 있어요. 오늘 산책에서 남긴 장면을 여러분과 공유해요.', 0, 18),
    content('p2', 'doha', 'post', '작업실의 마지막 불빛', '오늘 녹음을 마치고 남긴 한 장면입니다. 이번 주에는 새 트랙을 들려드릴게요.', 1, 87),
    content('p3', 'yuna', 'post', '여름을 보내는 방법', '지난 여행에서 간직해 둔 풍경이에요.', 2, 280),
    content('p4', 'noel', 'post', '이른 새벽의 공기', '아무도 없는 시간에 남긴 작은 기록.', 4, 320),
    content('live1', 'influencer123', 'live', '서린의 밤 산책', '오늘의 라이브 편성을 둘러보세요.', 0, 8),
    content('story1', 'doha', 'story', '작업실 스냅', '녹음하기 전, 오늘의 첫 번째 장면.', 1, 33),
    content('story2', 'yuna', 'story', '여행 사진 한 장', '해가 지기 직전의 바닷가.', 2, 58),
    ...mockPosts(Date.now()),
  ],
  subscriptions: { user123: ['influencer123', 'doha', 'yuna'] },
  balances: { user123: 120 },
  transactions: mockTransactions(Date.now(), approvedRoster),
  settlement: { coinWon: 50, feeBps: 0, overrides: {} },
  products: [
    { id: 'goods1', owner: 'influencer123', name: '야간 산책 필름', detail: '미공개 사진 3장', cost: 30, art: 0 },
    { id: 'goods2', owner: 'influencer123', name: '짧은 영상 편지', detail: '구독자에게 전하는 30초 인사', cost: 45, art: 1, kind: 'video' },
  ],
  roulettes: {
    influencer123: { cost: 20, rewards: [{ name: '비공개 사진', chance: 30 }, { name: '다음 기회에', chance: 70 }] },
  },
  messages: [
    { id: 'm1', customer: 'user123', creator: 'influencer123', from: 'influencer123', text: '밤결에 오신 걸 환영해요! 오늘의 사진은 어떠셨나요?', at: ago(16) },
  ],
}

export const packs = [
  { coins: 100, won: 4900, name: '라이트' },
  { coins: 250, won: 9900, name: '스탠다드' },
  { coins: 600, won: 19900, name: '플러스' },
]

export const kindNames = { post: '게시글', story: '스토리', live: '라이브' }
export const krw = (value) => '₩' + value.toLocaleString('ko-KR')
export const number = (value) => value.toLocaleString('ko-KR')

export function relativeTime(time) {
  const minutes = Math.max(1, Math.floor((Date.now() - time) / 60_000))
  if (minutes < 60) return minutes + '분 전'
  if (minutes < 1440) return Math.floor(minutes / 60) + '시간 전'
  return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(time)
}
