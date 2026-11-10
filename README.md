# 밤결 BAMGYEOL

크리에이터 구독 플랫폼 프론트엔드 데모. 반응형 React SPA에 TypeScript, Vite, Tailwind CSS 유틸리티, Zustand를 사용한다. 서비스 이름과 청록색 궤도 로고는 브랜드 가안이다.

## 실행

Node.js 22.12 이상에서 실행한다.

```bash
npm ci
npm run dev
npm run typecheck
npm run build
npm run preview
```

| 계정 | 아이디 | 초기 비밀번호 |
| --- | --- | --- |
| 관리자 | `admin123` | `admin123` |
| 인플루언서 | `influencer123` | `influencer123` |
| 고객 | `user123` | `user123` |

인플루언서 입점 전체 흐름은 새 인플루언서 데모 계정을 생성해 신청한 뒤, 같은 브라우저에서 관리자로 전환해 승인하고 원래 계정으로 돌아가 확인한다. 데모 데이터는 이 사이트의 브라우저 저장소에 남는다. 초기 데이터로 돌아가려면 사이트의 로컬 저장소에서 `bamgyeol-demo-v1` 키를 지운다.

## Cloudflare Pages

Git 연결 시 프로젝트 루트에서 빌드 명령 `npm run build`, 출력 디렉터리 `dist`, Node.js 22 버전을 사용한다. 직접 업로드 시에는 빌드 후 `dist`를 업로드한다. `public/_headers`는 빌드 시 출력 루트에 복사된다.

[Cloudflare Pages React 가이드](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) · [Cloudflare Pages 응답 헤더](https://developers.cloudflare.com/pages/configuration/headers/)

## 데모 범위

- 공개된 예제 계정과 Zustand 권한 분기는 같은 브라우저에서 역할별 동작을 확인하기 위한 것이다. 운영 권한 검증과 비밀번호 관리는 서버에서 구현해야 한다.
- PASS, 계좌 등록, 결제·송금, 채팅과 거래 장부는 로컬 체험 흐름이다. 실시간 채팅 동기화와 라이브 송출은 별도 서비스 연동이 필요하다.
- 구독 콘텐츠와 개별 구매 원본에는 비활성 탭 가림과 우클릭·드래그·인쇄 억제를 적용한다. 개별 판매 영상은 화면이 가려지면 일시 정지한다. 웹에서는 OS 화면 캡처나 녹화를 차단할 수 없다. 실제 구독 콘텐츠·인증 정보·계좌번호는 데모에 올리지 않는다.
- 룰렛 데모는 상품별 확률로 원판의 칸 크기를 정하고 같은 확률로 추첨한다. 고객 화면에 상품명, 당첨 확률, 회당 비용, 결과를 표시한다. 선택적으로 1등 확정 구매를 설정할 수 있다. 유료 운영 전 확률 고지와 누적 소비 조건을 검토한다.

## 문서

[고객](docs/customer.md) · [인플루언서](docs/influencer.md) · [관리자](docs/admin.md) · [기획 및 사용자 흐름](docs/plan.md)

[개발 지침 및 변경 이력](.agents/AGENTS.md)
