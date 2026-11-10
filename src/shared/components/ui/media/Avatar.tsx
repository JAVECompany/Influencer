import { useId } from 'react'
import { avatarPalettes } from '../../../constants/avatarPalettes'
import type { Account, Creator } from '../../../types/account'
import { portraitStyle } from '../../../utils/media/portraitStyle'

type AvatarPerson = Pick<Creator, 'name'> & Partial<Pick<Creator, 'art' | 'avatar' | 'portrait'>>

export default function Avatar({
  person,
  account,
  className = '',
}: {
  person?: AvatarPerson
  account?: Account
  className?: string
}) {
  const color = avatarPalettes[(person?.art ?? 0) % avatarPalettes.length] ?? avatarPalettes[0]
  const gradient = useId()
  const image = account?.avatar || person?.avatar
  if (image)
    return (
      <img src={image} alt="" className={`aspect-square shrink-0 rounded-full object-cover ${className}`} />
    )
  const portrait = portraitStyle(person?.portrait)
  if (portrait)
    return (
      <span
        aria-hidden="true"
        style={portrait}
        className={`block aspect-square shrink-0 rounded-full bg-raised bg-no-repeat ${className}`}
      />
    )
  if (person?.art === undefined)
    return (
      <span
        aria-hidden="true"
        className={`grid aspect-square shrink-0 place-items-center rounded-full bg-accent-soft font-black text-accent ${className}`}
      >
        {(account?.name || person?.name || '밤').slice(0, 1)}
      </span>
    )
  const variation = person.art % 3
  return (
    <svg
      aria-hidden="true"
      className={`aspect-square shrink-0 rounded-full ${className}`}
      viewBox="0 0 120 120"
    >
      <defs>
        <linearGradient id={gradient} x2="1" y2="1">
          <stop stopColor={color[0]} />
          <stop offset="1" stopColor={color[1]} />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${gradient})`} />
      <circle cx="97" cy="24" r="31" fill="#eee6c5" opacity=".15" />
      <path d="M6 120Q13 89 48 82L72 82Q107 89 114 120Z" fill={color[3]} />
      <path d="M28 62C16 5 100 3 94 60L97 93Q74 107 46 92L24 99Z" fill={color[3]} />
      <path d="M49 74h21v17q-11 12-21 0Z" fill={color[2]} />
      <path d="M41 43Q59 31 80 45L79 61Q76 84 61 87Q46 84 41 66Z" fill={color[2]} />
      <path
        d={
          variation === 1
            ? 'M34 53Q29 23 61 22Q82 23 89 44Q65 42 58 34Q53 53 34 53Z'
            : 'M34 65Q26 23 63 24Q84 24 87 49Q64 47 59 35Q56 54 39 58L41 78Z'
        }
        fill={color[3]}
      />
      <path d="M50 61h4m12 0h4" stroke={color[3]} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M57 73q4 3 8 0" stroke="#935950" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {variation !== 1 && <circle cx="79" cy="73" r="2" fill="#f4c785" />}
    </svg>
  )
}
