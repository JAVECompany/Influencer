export default function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg className="size-9 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="14" fill="var(--theme-accent)" />
        <path
          d="M31.8 16.3a11 11 0 1 0 1.5 12.8 9.1 9.1 0 0 1-10.8-12.6 11 11 0 0 0 9.3-.2Z"
          fill="var(--theme-on-accent)"
        />
        <ellipse
          cx="24"
          cy="25"
          rx="18"
          ry="6.7"
          transform="rotate(-32 24 25)"
          fill="none"
          stroke="var(--theme-on-accent)"
          strokeWidth="1.6"
        />
        <circle cx="36" cy="12" r="2.4" fill="var(--theme-on-accent)" />
      </svg>
      <span className="text-xl leading-none font-bold tracking-tight">밤결</span>
    </div>
  )
}
