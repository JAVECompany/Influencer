import { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode, SyntheticEvent } from 'react'
import { ArrowLeft, CircleHelp, LockKeyhole, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { palettes } from './data'
import { portraitStyle } from './demo-data'
import { ContentPrivacy } from './content-privacy'
import type { Account, Creator } from './types'

export const panel = 'rounded-2xl border border-edge bg-panel'
export const Feedback = createContext<{ text: string; error: boolean } | null>(null)
export const field = 'w-full rounded-xl border border-edge bg-night px-4 py-3 text-sm text-white placeholder:text-dim/70 focus:border-mint focus:outline-none'
const buttonStyles = {
  primary: 'bg-mint text-[#082621] hover:bg-[#99f5df]',
  subtle: 'border border-edge bg-panel hover:border-mint/60 hover:text-mint',
  plain: 'text-dim hover:bg-white/5 hover:text-white',
  danger: 'border border-red-400/40 text-red-200 hover:bg-red-400/10',
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & { tone?: keyof typeof buttonStyles }
export function Button({ children, tone = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-45 ${buttonStyles[tone]} ${className}`} {...props}>{children}</button>
}

export function Label({ title, children }: { title: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold">{title}{children}</label>
}

export function Brand() {
  return <div className="flex items-center gap-3">
    <img className="size-10 shrink-0" src="/orbit.svg" alt="" />
    <div><p className="text-xl leading-none font-black tracking-tight">밤결</p><p className="mt-1 text-[9px] leading-none font-bold tracking-[.25em] text-dim">BAMGYEOL</p></div>
  </div>
}

export function PageTitle({ label, title, subtitle, children }: { label?: string; title: string; subtitle?: string; children?: ReactNode }) {
  return <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      {label && <p className="mb-2.5 text-[11px] font-bold tracking-[.18em] text-mint uppercase">{label}</p>}
      <h1 className="text-3xl leading-tight font-black tracking-tight sm:text-[34px]">{title}</h1>
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-dim">{subtitle}</p>}
    </div>
    {children}
  </header>
}

export function Empty({ title, description, children, icon: Icon = CircleHelp }: {
  title: string; description?: string; children?: ReactNode; icon?: LucideIcon
}) {
  return <div className={`${panel} grid justify-items-center gap-3 px-5 py-12 text-center`}>
    <Icon size={28} className="text-mint" aria-hidden="true" />
    <p className="font-bold">{title}</p>
    {description && <p className="max-w-sm text-sm leading-relaxed text-dim">{description}</p>}
    {children}
  </div>
}

export function Back({ onClick }: { onClick: () => void }) {
  return <Button tone="plain" className="mb-3 -ml-2" onClick={onClick}><ArrowLeft size={17} /> 뒤로</Button>
}

export function Modal({ title, onClose, children, protectedContent = false }: {
  title: string; onClose: () => void; children: ReactNode; protectedContent?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const heading = useId()
  const message = useContext(Feedback)
  const mask = useContext(ContentPrivacy)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return <dialog ref={ref} aria-labelledby={heading} data-protected={protectedContent || undefined} onCancel={(event) => { event.preventDefault(); onClose() }}
    className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-auto rounded-2xl border border-edge bg-panel p-5 text-white shadow-2xl sm:p-6">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 id={heading} className="text-lg font-black">{protectedContent && mask ? '구독 전용 콘텐츠' : title}</h2>
      <button type="button" aria-label="닫기" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-xl text-dim hover:bg-white/10"><X size={19} /></button>
    </div>
    {message?.error && <p role="alert" className="mb-4 rounded-xl border border-red-300/40 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{message.text}</p>}
    {children}
  </dialog>
}

export function Badge({ children, live = false }: { children: ReactNode; live?: boolean }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${live ? 'bg-[#ec486d] text-white' : 'bg-[#1a3636] text-mint'}`}>{children}</span>
}

type AvatarPerson = Pick<Creator, 'name'> & Partial<Pick<Creator, 'art' | 'avatar' | 'portrait'>>
export function Avatar({ person, account, className = '' }: { person?: AvatarPerson; account?: Account; className?: string }) {
  const color = palettes[(person?.art ?? 0) % palettes.length] ?? palettes[0]
  const gradient = useId()
  const image = account?.avatar || person?.avatar
  if (image) return <img src={image} alt="" className={`aspect-square shrink-0 rounded-full object-cover ${className}`} />
  const portrait = portraitStyle(person?.portrait)
  if (portrait) return <span aria-hidden="true" style={portrait} className={`block aspect-square shrink-0 rounded-full bg-[#30443d] bg-no-repeat ${className}`} />
  if (person?.art === undefined) return <span aria-hidden="true" className={`grid aspect-square shrink-0 place-items-center rounded-full bg-[#193938] font-black text-mint ${className}`}>{(account?.name || person?.name || '밤').slice(0, 1)}</span>
  const variation = person.art % 3
  return <svg aria-hidden="true" className={`aspect-square shrink-0 rounded-full ${className}`} viewBox="0 0 120 120">
    <defs><linearGradient id={gradient} x2="1" y2="1"><stop stopColor={color[0]} /><stop offset="1" stopColor={color[1]} /></linearGradient></defs>
    <rect width="120" height="120" fill={`url(#${gradient})`} />
    <circle cx="97" cy="24" r="31" fill="#eee6c5" opacity=".15" />
    <path d="M6 120Q13 89 48 82L72 82Q107 89 114 120Z" fill={color[3]} />
    <path d="M28 62C16 5 100 3 94 60L97 93Q74 107 46 92L24 99Z" fill={color[3]} />
    <path d="M49 74h21v17q-11 12-21 0Z" fill={color[2]} />
    <path d="M41 43Q59 31 80 45L79 61Q76 84 61 87Q46 84 41 66Z" fill={color[2]} />
    <path d={variation === 1 ? 'M34 53Q29 23 61 22Q82 23 89 44Q65 42 58 34Q53 53 34 53Z' : 'M34 65Q26 23 63 24Q84 24 87 49Q64 47 59 35Q56 54 39 58L41 78Z'} fill={color[3]} />
    <path d="M50 61h4m12 0h4" stroke={color[3]} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M57 73q4 3 8 0" stroke="#935950" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    {variation !== 1 && <circle cx="79" cy="73" r="2" fill="#f4c785" />}
  </svg>
}

export function Scene({ art = 0, className = '' }) {
  const gradient = useId()
  const glow = useId()
  const water = useId()
  const sky = [
    ['#101d3d', '#e47d71', '#0a1829', '#ffc18a'],
    ['#291936', '#b56f71', '#1c1f39', '#f9cb92'],
    ['#143b53', '#88b2ad', '#152d3c', '#f2db9e'],
    ['#2b264b', '#db9a7f', '#1f213e', '#ffd3a4'],
    ['#202a46', '#9b859e', '#192639', '#f3b8a3'],
  ][art % 5]
  const buildings = [48, 38, 76, 56, 69, 101, 49, 42, 67, 52, 92, 64, 44, 82, 50, 36, 62, 41, 75, 34, 47, 55, 37, 67, 45]
  return <svg className={className} aria-hidden="true" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={gradient} x2="0" y2="1"><stop stopColor={sky[0]} /><stop offset=".8" stopColor={sky[1]} /><stop offset="1" stopColor={sky[3]} /></linearGradient>
      <radialGradient id={glow}><stop stopColor={sky[3]} stopOpacity=".6" /><stop offset="1" stopColor={sky[3]} stopOpacity="0" /></radialGradient>
      <linearGradient id={water} x2="0" y2="1"><stop stopColor={sky[1]} /><stop offset=".45" stopColor={sky[2]} /><stop offset="1" stopColor="#08111e" /></linearGradient>
    </defs>
    <rect width="800" height="450" fill={`url(#${gradient})`} />
    <ellipse cx="526" cy="233" rx="210" ry="153" fill={`url(#${glow})`} />
    <circle cx="526" cy="180" r="28" fill={sky[3]} />
    {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(i * 127 + 17) % 800} cy={(i * 19 + 31) % 142} r={i % 3 ? '.65' : '1.2'} opacity={i % 3 ? '.35' : '.75'} fill="#f0ded0" />)}
    <path d="M0 192Q137 157 264 182T488 178Q352 207 170 203T0 221ZM365 103Q506 105 615 129Q718 145 800 119V150Q702 166 590 141Z" fill={sky[0]} opacity=".25" />
    <path d="M0 269 69 230 98 244 153 217 208 254 273 239 367 283 447 259 515 275 579 248 650 261 724 219 800 242V333H0Z" fill={sky[0]} opacity=".72" />
    <rect y="313" width="800" height="137" fill={`url(#${water})`} />
    {Array.from({ length: 31 }, (_, i) => <path key={i} d={`M${(i * 103 + 13) % 800} ${322 + (i * 37) % 121}h${17 + (i * 17) % 83}`} stroke={sky[i % 2 ? 1 : 3]} opacity={.11 + (i % 5) * .04} strokeWidth={i % 4 ? 1 : 2} />)}
    {buildings.map((height, i) => {
      const x = i * 33 - 11
      const y = 316 - height * (i > 12 ? .61 : .96)
      return <g key={i} transform={`translate(${x} ${y})`}>
        <path d={`M0 ${316 - y}V0h${27 + i % 5}v${316 - y}Z`} fill={i % 3 === 0 ? '#111a2d' : sky[2]} />
        {Array.from({ length: Math.floor((316 - y) / 11) * 3 }, (_, j) => (
          <rect key={j} x={5 + (j % 3) * 8} y={5 + Math.floor(j / 3) * 11} width="3.5" height="2.5" rx=".6" fill={sky[3]} opacity={(j * 7 + i) % 5 < 2 ? '.78' : '.14'} />
        ))}
      </g>
    })}
    <path d="M0 316H800" stroke={sky[3]} strokeWidth="1" opacity=".65" />
    <path d="M0 410Q138 387 237 409T441 430Q614 414 800 396V450H0Z" fill="#090f1a" opacity=".53" />
  </svg>
}

const watermarkTime = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul', dateStyle: 'short', timeStyle: 'short',
})

export function Protected({ viewer, children, className = '' }: { viewer: string; children: ReactNode; className?: string }) {
  const mask = useContext(ContentPrivacy)
  const [openedAt] = useState(() => watermarkTime.format(Date.now()) + ' KST')
  const block = (event: SyntheticEvent) => event.preventDefault()
  return <div data-protected onContextMenu={block} onDragStart={block} onCopy={block} className={`relative isolate overflow-hidden select-none ${className}`}>
    <div className={mask ? 'invisible' : undefined} aria-hidden={Boolean(mask)}>{children}</div>
    {!mask && <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 grid grid-cols-2 place-items-center overflow-hidden text-[10px] font-black tracking-widest text-white/25">
      {Array.from({ length: 6 }, (_, i) => <span key={i} className="max-w-full -rotate-17 rounded-md bg-black/20 px-1.5 py-1 text-center text-white/50 sm:px-2">
        <span className="block break-all">{viewer} · 밤결</span><span className="block text-[8px] tracking-normal">{openedAt}</span>
      </span>)}
    </div>}
    {mask && <div className="absolute inset-0 grid place-content-center gap-2 bg-night/95 text-center text-xs text-dim"><LockKeyhole className="mx-auto" size={20} />{mask === 'print' ? '인쇄 중에는 콘텐츠를 가립니다.' : '탭으로 돌아오면 다시 볼 수 있어요.'}</div>}
  </div>
}

export function fileData(file: File | null | undefined, allowVideo = false): Promise<string> {
  if (!file) return Promise.resolve('')
  const image = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
  const video = allowVideo && ['video/mp4', 'video/webm'].includes(file.type)
  if ((!image && !video) || file.size > 280_000) {
    return Promise.reject(new Error(allowVideo ? '지원하는 사진 또는 MP4·WebM 영상을 280 KB 이하로 선택해 주세요.' : 'PNG, JPG 또는 WEBP 이미지를 280 KB 이하로 선택해 주세요.'))
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('파일을 읽을 수 없습니다.'))
    reader.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'))
    reader.readAsDataURL(file)
  })
}
