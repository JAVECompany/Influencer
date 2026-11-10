import FieldLabel from '../../../shared/components/ui/forms/FieldLabel'
import { field } from '../../../shared/styles/controlStyles'

export default function ShippingAddressFields() {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-2 text-sm font-bold">배송지</legend>
      <p className="text-xs text-muted">모의 주문입니다. 예시 배송 정보를 입력해 주세요.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldLabel title="받는 분">
          <input name="recipient" required maxLength={50} autoComplete="off" className={field} />
        </FieldLabel>
        <FieldLabel title="연락처">
          <input name="phone" required type="tel" maxLength={16} autoComplete="off" className={field} />
        </FieldLabel>
      </div>
      <FieldLabel title="우편번호 (5자리)">
        <input
          name="postalCode"
          required
          inputMode="numeric"
          pattern="[0-9]{5}"
          maxLength={5}
          autoComplete="off"
          className={field}
        />
      </FieldLabel>
      <FieldLabel title="기본 주소">
        <input name="address" required maxLength={160} autoComplete="off" className={field} />
      </FieldLabel>
      <FieldLabel title="상세 주소 (선택)">
        <input name="addressDetail" maxLength={100} autoComplete="off" className={field} />
      </FieldLabel>
    </fieldset>
  )
}
