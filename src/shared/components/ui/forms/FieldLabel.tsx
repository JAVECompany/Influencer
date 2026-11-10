import type { ReactNode } from 'react'

export default function FieldLabel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {title}
      {children}
    </label>
  )
}
