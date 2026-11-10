export default function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="size-11 shrink-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: 'var(--theme-brand-mark)' }}
      />
      <span className="text-xl leading-none font-bold tracking-tight">밤결</span>
    </div>
  )
}
