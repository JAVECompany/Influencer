import type { ComponentPropsWithoutRef } from 'react'

const buttonStyles = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  subtle: 'border border-line bg-surface hover:border-accent/60 hover:text-accent',
  plain: 'text-muted hover:bg-foreground/5 hover:text-foreground',
  danger: 'border border-danger/40 text-danger hover:bg-danger/10',
}

type ButtonPropsType = ComponentPropsWithoutRef<'button'> & { tone?: keyof typeof buttonStyles }

export default function Button({
  children,
  tone = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonPropsType) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-45 ${buttonStyles[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
