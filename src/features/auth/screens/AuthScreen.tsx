import type { PageProps } from '../../../shared/types/navigation'
import AuthForm from '../components/AuthForm'
import AuthHero from '../components/AuthHero'

export default function AuthScreen({ notify }: Pick<PageProps, 'notify'>) {
  return (
    <main className="mx-auto grid min-h-dvh max-w-[1330px] items-center gap-8 px-5 py-9 lg:grid-cols-[1.25fr_1fr] lg:px-12 lg:py-12">
      <AuthHero />
      <AuthForm notify={notify} />
    </main>
  )
}
