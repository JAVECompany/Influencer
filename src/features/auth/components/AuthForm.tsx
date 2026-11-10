import { ArrowRight } from 'lucide-react'
import BrandLogo from '../../../shared/components/ui/branding/BrandLogo'
import Button from '../../../shared/components/ui/actions/Button'
import FieldLabel from '../../../shared/components/ui/forms/FieldLabel'
import { roles } from '../../../shared/constants/roles'
import { demoAccounts } from '../../../shared/data/demoAccounts'
import { field, panel } from '../../../shared/styles/controlStyles'
import type { IPageProps } from '../../../shared/types/navigation'
import { useAuthForm } from '../hooks/useAuthForm'

export default function AuthForm({ notify }: Pick<IPageProps, 'notify'>) {
  const {
    signup,
    id,
    setId,
    password,
    setPassword,
    adult,
    setAdult,
    terms,
    setTerms,
    submit,
    selectDemo,
    toggleSignup,
  } = useAuthForm(notify)
  return (
    <section className="mx-auto w-full max-w-[450px]">
      <div className="mb-8 lg:hidden">
        <BrandLogo />
      </div>
      <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
        {signup ? '계정 만들기' : '로그인'}
      </h2>
      <form className="grid gap-4" onSubmit={submit}>
        {signup && (
          <>
            <FieldLabel title="가입 유형">
              <select name="role" className={field}>
                <option value="customer">고객</option>
                <option value="influencer">크리에이터</option>
              </select>
            </FieldLabel>
            <label className="flex items-start gap-2 text-sm text-muted">
              <input
                type="checkbox"
                required
                checked={terms}
                onChange={(event) => setTerms(event.target.checked)}
                className="mt-1 accent-accent"
              />
              데모 이용 조건에 동의합니다. 입력 정보는 이 브라우저에 저장됩니다.
            </label>
            <Button tone="subtle" onClick={() => setAdult(!adult)} aria-pressed={adult}>
              {adult ? '만 19세 이상 확인 완료 · 모의' : 'PASS 성인 확인 체험 · 만 19세 이상'}
            </Button>
          </>
        )}
        <FieldLabel title="아이디">
          <input
            required
            value={id}
            onChange={(event) => setId(event.target.value)}
            className={field}
            maxLength={24}
            autoComplete="username"
            placeholder="아이디 입력"
          />
        </FieldLabel>
        <FieldLabel title="비밀번호">
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={field}
            minLength={signup ? 6 : undefined}
            maxLength={72}
            autoComplete={signup ? 'new-password' : 'current-password'}
            placeholder="비밀번호 입력"
          />
        </FieldLabel>
        {signup && (
          <FieldLabel title="닉네임">
            <input required name="name" maxLength={20} className={field} placeholder="중복되지 않는 닉네임" />
          </FieldLabel>
        )}
        <Button type="submit" className="mt-1 min-h-12 justify-between">
          {signup ? '데모 계정 만들기' : '로그인'} <ArrowRight size={17} />
        </Button>
      </form>
      {!signup && (
        <div className={`${panel} mt-5 p-4`}>
          <p className="mb-3 text-xs font-semibold text-muted">체험 계정</p>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((demo) => (
              <Button
                key={demo.id}
                tone="subtle"
                className="px-1 text-xs"
                onClick={() => selectDemo(demo.id)}
              >
                {roles[demo.role]}
              </Button>
            ))}
          </div>
        </div>
      )}
      <Button tone="plain" className="mt-3 w-full" onClick={toggleSignup}>
        {signup ? '로그인으로 돌아가기' : '새 데모 계정 만들기'}
      </Button>
    </section>
  )
}
