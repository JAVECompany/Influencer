import { Sparkles } from 'lucide-react'
import BrandLogo from '../../../shared/components/ui/BrandLogo'
import DemoScene from '../../../shared/components/ui/DemoScene'

export default function AuthHero() {
  return (
    <section className="relative hidden min-h-[650px] overflow-hidden rounded-[36px] border border-edge bg-[#172338] lg:flex lg:flex-col">
      <DemoScene className="absolute inset-0 h-full w-full opacity-80" />
      <div className="absolute inset-0 bg-linear-to-b from-[#0c1625]/90 via-transparent to-[#0b1421]" />
      <div className="relative z-10 p-9">
        <BrandLogo />
      </div>
      <div className="relative z-10 mt-auto p-9 xl:p-12">
        <p className="mb-4 flex items-center gap-2 text-xs font-black tracking-[.2em] text-mint">
          <Sparkles size={16} /> YOUR PRIVATE ORBIT
        </p>
        <h1 className="text-4xl leading-[1.16] font-black tracking-tight xl:text-5xl">
          좋아하는 이야기와
          <br />더 가까이.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#d7e1ec]">
          구독으로 이어지는 크리에이터의 일상, 밤결에서 만나보세요.
        </p>
      </div>
    </section>
  )
}
