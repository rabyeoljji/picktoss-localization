## 주요 라이브러리 문서

Pick-Toss 애플리케이션에서 사용되는 주요 라이브러리에 대한 문서는 다음 링크에서 확인할 수 있습니다:

### 라우팅 시스템

- [타입 안전한 라우팅 시스템 가이드](./src/shared/lib/router/README.md) - `useRouter` 훅과 `Link` 컴포넌트를 사용한 타입 안전한 라우팅 방법을 설명합니다.

  - 경로 파라미터와 쿼리 파라미터를 타입 안전하게 처리
  - 타입스크립트를 활용한 경로 검증
  - 라우팅 관련 유틸리티 함수 사용법

- [쿼리 파라미터 사용 가이드](./src/shared/lib/router/query-param/README.md) - `useQueryParam` 훅을 사용한 URL 쿼리 파라미터 관리 방법을 설명합니다.
  - URL 쿼리 파라미터를 React 상태처럼 사용
  - 타입 안전한 쿼리 파라미터 처리
  - 경로별 쿼리 파라미터 설정 방법

### 스토리지 시스템

- [타입 안전한 스토리지 시스템 가이드](./src/shared/lib/storage/README.md) - `useLocalStorage`와 `useSessionStorage` 훅을 사용한 브라우저 스토리지 관리 방법을 설명합니다.
  - 로컬 스토리지와 세션 스토리지를 React 상태와 동기화
  - 타입 안전한 스토리지 키와 값 처리
  - 스토리지 관련 유틸리티 함수 사용법
