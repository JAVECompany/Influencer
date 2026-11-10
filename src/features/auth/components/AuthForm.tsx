import { ArrowRight } from 'lucide-react'
import BrandLogo from '../../../shared/components/ui/BrandLogo'
import Button from '../../../shared/components/ui/Button'
import FieldLabel from '../../../shared/components/ui/FieldLabel'
import { roles } from '../../../shared/constants/roles'
import { demoAccounts } from '../../../shared/data/demoAccounts'
import { field, panel } from '../../../shared/styles/controlStyles'
import type { PageProps } from '../../../shared/types/navigation'
import { useAuthForm } from '../hooks/useAuthForm'

export default function AuthForm({ notify }: Pick<PageProps, 'notify'>) {
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
      <p className="mb-2 text-xs font-bold tracking-[.18em] text-mint">
        {signup ? 'CREATE ACCOUNT' : 'BAMGYEOL DEMO'}
      </p>
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
        {signup ? '밤결에 가입하기' : '밤결에 오신 걸 환영해요'}
      </h2>
      <p className="mt-3 mb-6 text-sm leading-relaxed text-dim">
        {signup
          ? '같은 브라우저에서 가입과 입점 흐름을 체험할 수 있어요.'
          : '로그인하고 역할별 화면을 체험해 보세요.'}
      </p>
      <form className="grid gap-4" onSubmit={submit}>
        {signup && (
          <>
            <FieldLabel title="가입 유형">
              <select name="role" className={field}>
                <option value="customer">고객</option>
                <option value="influencer">크리에이터</option>
              </select>
            </FieldLabel>
            <label className="flex items-start gap-2 text-sm text-dim">
              <input
                type="checkbox"
                required
                checked={terms}
                onChange={(event) => setTerms(event.target.checked)}
                className="mt-1 accent-mint"
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
          <p className="mb-3 text-xs font-bold text-dim">체험 계정 · 선택하면 아이디와 비밀번호가 입력돼요</p>
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
