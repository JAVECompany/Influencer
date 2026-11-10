import type { ReactNode } from 'react'

export default function Badge({ children, live = false }: { children: ReactNode; live?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${
        live ? 'bg-[#ec486d] text-white' : 'bg-[#1a3636] text-mint'
      }`}
    >
      {children}
    </span>
  )
}
