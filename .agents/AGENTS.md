# 밤결 개발 지침

- 이 저장소는 React, TypeScript, Vite, Tailwind CSS, Zustand로 구성된 크리에이터 구독 플랫폼 데모다. 현재 인증, 거래, 정산, 채팅 상태는 브라우저에서 처리한다.
- 작업 전에 `rg --files`, `rg -n`, `git status --short`로 구조와 사용처, 기존 변경을 확인한다. 사용자가 작성한 변경과 기능 문서의 기존 내용을 보존한다.
- 변경의 책임과 사용 범위를 먼저 정한다. 한 페이지에서만 쓰는 코드는 그 페이지 폴더에, 여러 페이지에서 실제로 재사용하는 코드는 `src/shared/`에 둔다.
- 코드를 추가하거나 수정할 때는 항상 [.prettierrc.json](../.prettierrc.json)과 프론트엔드 포맷 규칙을 적용한다.
- 사용자가 별도로 요청한 경우에만 테스트 작성·실행, 린트, 빌드를 수행한다. 다른 명령에 포함된 간접 실행에도 동일한 기준을 적용한다.
- 작업 결과는 실제 구현과 검증 상태에 맞춰 한글 UTF-8로 기록한다. 커밋을 요청받으면 논리 단위로 묶고 한글 Conventional Commits 제목을 사용한다.

## 작업별 문서

| 범위 | 규칙 | 변경 이력 |
| --- | --- | --- |
| 화면, 브라우저 상태, 로컬 데모 정책 | [RULE_FE.md](RULE_FE.md) | [CHANGELOG_FE.md](CHANGELOG_FE.md) |
| 서버, DB, 외부 서비스 연동 | [RULE_BE.md](RULE_BE.md) | [CHANGELOG_BE.md](CHANGELOG_BE.md) |

기능 요구사항은 [기획 및 사용자 흐름](../docs/plan.md), [고객](../docs/customer.md), [인플루언서](../docs/influencer.md), [관리자](../docs/admin.md) 문서를 확인한다.
