import type { ComponentPropsWithoutRef } from 'react'

const buttonStyles = {
  primary: 'bg-mint text-[#082621] hover:bg-[#99f5df]',
  subtle: 'border border-edge bg-panel hover:border-mint/60 hover:text-mint',
  plain: 'text-dim hover:bg-white/5 hover:text-white',
  danger: 'border border-red-400/40 text-red-200 hover:bg-red-400/10',
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & { tone?: keyof typeof buttonStyles }

export default function Button({
  children,
  tone = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
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
