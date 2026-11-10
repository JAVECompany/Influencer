import BrandLogo from '../../../shared/components/ui/branding/BrandLogo'
import DemoScene from '../../../shared/components/ui/media/DemoScene'

export default function AuthHero() {
  return (
    <section className="relative hidden min-h-[650px] overflow-hidden rounded-[36px] border border-line bg-surface lg:flex lg:flex-col">
      <DemoScene className="absolute inset-0 h-full w-full opacity-65" />
      <div className="absolute inset-0 theme-auth-overlay" />
      <div className="relative z-10 p-9">
        <BrandLogo />
      </div>
      <div className="relative z-10 mt-auto p-9 xl:p-12">
        <h1 className="text-4xl leading-[1.16] font-black tracking-tight xl:text-5xl">
          좋아하는 이야기와
          <br />더 가까이.
        </h1>
      </div>
    </section>
  )
}
