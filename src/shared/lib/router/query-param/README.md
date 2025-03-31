# useQueryParam 훅 사용 가이드

이 문서는 Pick-Toss 애플리케이션의 URL 쿼리 파라미터를 관리하는 `useQueryParam` 훅의 사용법을 설명합니다.

## 목차

1. [기본 사용법](#기본-사용법)
2. [사용했을 때의 장점](#사용했을-때의-장점)
3. [자세한 사용법](#자세한-사용법)
4. [구현 내용](#구현-내용)
5. [주의점](#주의점)

## 기본 사용법

`useQueryParam` 훅은 URL의 쿼리 파라미터를 React 상태처럼 사용할 수 있게 해주는 함수입니다.

```tsx
import { useQueryParam } from '@/shared/lib/router/query-param'

const MyComponent = () => {
  // 기본 사용법: [값, 설정 함수, 초기화 함수]
  const [search, setSearch, resetSearch] = useQueryParam('/search', 'q')

  // 반환되는 타입은 SearchConfig에 정의된 타입에 따라 자동으로 결정됨
  const [name, setName, resetName] = useQueryParam('/progress-quiz/:quizId', 'name') // '유민' | '정우' 타입
  const [page, setPage, resetPage] = useQueryParam('/search', 'page') // number 타입
  const [showAll, setShowAll, resetShowAll] = useQueryParam('/filter', 'active') // boolean 타입

  // 여러 쿼리 파라미터 관리
  const [params, setParams, resetParams] = useQueryParam('/search')

  return (
    <div>
      <input value={search || ''} onChange={(e) => setSearch(e.target.value)} placeholder="검색어 입력" />
      <button onClick={() => resetSearch()}>검색어 초기화</button>

      <button onClick={() => setPage(page + 1)}>다음 페이지</button>
      <button onClick={() => resetPage()}>페이지 초기화</button>

      <label>
        <input type="checkbox" checked={showAll} onChange={() => setShowAll(!showAll)} />
        모두 보기
      </label>
      <button onClick={() => resetShowAll()}>필터 초기화</button>

      {/* 모든 파라미터 한번에 변경 */}
      <button onClick={() => setParams({ q: '새 검색어', page: 1, showAll: true })}>모두 설정</button>
      <button onClick={() => resetParams()}>모두 초기화</button>
    </div>
  )
}
```

## 사용했을 때의 장점

1. **강화된 타입 안전성**:

   - 경로와 쿼리 파라미터 키가 `SearchConfig`에 정의된 값으로 엄격하게 제한됩니다.
   - 각 경로별로 사용 가능한 쿼리 파라미터와 정확한 타입이 자동으로 추론됩니다.
   - 인텔리센스에서 해당 경로에 유효한 파라미터만 자동완성으로 제안됩니다.
   - 잘못된 파라미터 키 사용 시 컴파일 시점에서 오류를 발생시킵니다.

2. **URL과 상태 동기화**:

   - URL 쿼리 파라미터와 컴포넌트 상태가 자동으로 동기화됩니다.
   - 페이지 새로고침 후에도 상태가 유지됩니다.

3. **사용 편의성**:

   - React의 `useState`와 유사한 API로 쉽게 사용할 수 있습니다.
   - `SearchConfig`에 정의된 타입에 따라 자동으로 타입 변환이 처리됩니다 (문자열 ↔ 숫자, 문자열 ↔ 불리언).
   - 쿼리 파라미터 초기화 기능이 내장되어 있어 상태 관리가 용이합니다.

4. **히스토리 관리 옵션**:
   - 쿼리 파라미터 변경 시 히스토리 항목 추가 여부를 제어할 수 있습니다.
   - 빈 값 처리 방식을 제어할 수 있습니다.
   - 개별 작업마다 옵션을 오버라이드할 수 있어 유연하게 사용 가능합니다.

## 자세한 사용법

### 기본 형태

```tsx
const [value, setValue, resetValue] = useQueryParam(path, key, options?)
```

- **path**: 경로 문자열 (예: '/search', '/progress-quiz/:quizId')
- **key**: 쿼리 파라미터 키 (예: 'q', 'page')
- **options**: 옵션 객체 (선택적)

### 타입별 사용법

쿼리 파라미터의 타입은 `SearchConfig`에 정의된 타입에 따라 자동으로 결정됩니다:

1. **문자열 파라미터**:

   ```tsx
   const [name, setName, resetName] = useQueryParam('/progress-quiz/:quizId', 'name')
   // SearchConfig에 name: '유민' as '유민' | '정우'로 정의된 경우, name은 '유민' | '정우' 타입
   ```

2. **숫자 파라미터**:

   ```tsx
   const [page, setPage, resetPage] = useQueryParam('/search', 'page')
   // SearchConfig에 page: 0으로 정의된 경우, page는 number 타입
   // URL에 ?page=5가 있으면 page는 숫자 5
   ```

3. **불리언 파라미터**:
   ```tsx
   const [active, setActive, resetActive] = useQueryParam('/filter', 'active')
   // SearchConfig에 active: false로 정의된 경우, active는 boolean 타입
   // URL에 ?active=true가 있으면 active는 true
   ```

### 여러 쿼리 파라미터 관리

```tsx
const [params, setParams, resetParams] = useQueryParam('/search')

// 모든 파라미터 가져오기
console.log(params) // { q: '검색어', page: 1, ... }

// 여러 파라미터 설정
setParams({ q: '새 검색어', page: 1 })

// 함수형 업데이터 사용
setParams((prev) => ({ ...prev, page: prev.page + 1 }))

// 모든 파라미터 초기화
resetParams()
```

### 옵션 설정

```tsx
const [filter, setFilter, resetFilter] = useQueryParam('/search', 'filter', {
  // 히스토리 옵션
  push: true, // true: 히스토리에 새 항목 추가, false: 현재 항목을 대체 (기본값: false)

  // 빈 값 처리 방법 (기본값: 'remove')
  // - 'remove': 빈 값을 URL에서 완전히 제거 (예: ?filter='' → URL에서 제거)
  // - 'preserve': 빈 값을 URL에 유지 (예: ?filter='')
  emptyHandling: 'preserve',
})
```

### 옵션 오버라이드

설정 및 초기화 함수를 호출할 때 옵션을 오버라이드할 수 있습니다:

```tsx
// 값 설정 시 옵션 오버라이드
setFilter('category', { push: false }) // 히스토리 항목을 추가하지 않고 설정

// 초기화 시 옵션 오버라이드
resetFilter({ push: false }) // 히스토리 항목을 추가하지 않고 초기화

// 여러 파라미터 설정 시 옵션 오버라이드
setParams({ q: '검색어', page: 1 }, { push: false })
```

### 타입 검증과 자동 완성

`SearchConfig`에 정의된 경로와 쿼리 파라미터에 대해 엄격한 타입 검증이 이루어집니다:

```tsx
// '/progress-quiz/:quizId' 경로에 대해 정의된 키만 자동 완성됨
const [name, setName] = useQueryParam('/progress-quiz/:quizId', 'name') // 정상 작동

// 'invalid'는 SearchConfig에 정의되지 않은 파라미터이므로 타입 오류
const [invalid, setInvalid] = useQueryParam('/progress-quiz/:quizId', 'invalid') // 타입 오류

// 타입 인텔리센스가 '/search' 경로에 대해 정의된 파라미터 키 목록을 제안
useQueryParam('/search', '...') // 'q', 'page', 'sort' 등이 자동 완성으로 제안됨
```

## 구현 내용

### useQueryParam 훅

`useQueryParam` 훅은 다음과 같은 기능을 제공합니다:

1. **쿼리 파라미터 추출**:

   - 현재 URL에서 지정된 키의 쿼리 파라미터 값을 추출합니다.
   - URL에 파라미터가 없으면 `SearchConfig`에 정의된 초기값을 사용합니다.

2. **타입 변환**:

   - `SearchConfig`에 정의된 타입에 따라 파라미터 값을 적절한 타입으로 변환합니다.
   - 문자열 → 숫자, 문자열 → 불리언 변환을 지원합니다.

3. **값 설정 및 초기화**:
   - 새 값을 설정하면 URL의 쿼리 파라미터가 업데이트됩니다.
   - 값을 초기화하면 URL에서 해당 쿼리 파라미터가 삭제됩니다.
   - 옵션에 따라 히스토리 항목 추가 여부와 빈 값 처리 방식이 결정됩니다.

### 타입 시스템

`useQueryParam` 훅은, 효과적인 타입 추론을 위해 여러 오버로드로 구현되어 있습니다:

1. **특정 경로와 키에 대한 정확한 타입 추론** (가장 구체적인 오버로드):

   ```typescript
   function useQueryParam<R extends RouteNames, K extends StrictQueryParamKeys<R>>(
     path: R, key: K, options?: QueryParamOptions
   ): [StrictQueryParamValue<R, K>, ... ]
   ```

2. **특정 경로의 모든 쿼리 파라미터 객체 반환**:

   ```typescript
   function useQueryParam<R extends RouteNames>(
     path: R, options?: QueryParamOptions
   ): [QueryParamObject<R>, ... ]
   ```

3. **일반 문자열 타입 경로와 키에 대한 기본 오버로드**:
   ```typescript
   function useQueryParam(path: string, key: string, ...): [string, ... ]
   ```

이 오버로드 구조를 통해 경로와 키에 따라 정확한 타입 추론이 이루어지며, 코드 작성 시 자동 완성 기능이 제대로 동작합니다.

## 주의점

1. **URL 길이 제한**:

   - URL은 브라우저와 서버에 따라 길이 제한이 있습니다.
   - 너무 많은 쿼리 파라미터 또는 너무 긴 값을 사용하면 잘릴 수 있습니다.

2. **타입 변환 제한**:

   - 현재 지원되는 타입 변환은 문자열, 숫자, 불리언입니다.
   - 배열이나 객체 같은 복잡한 타입은 직접 직렬화/역직렬화를 해야 합니다.

3. **동기화 문제**:

   - 여러 컴포넌트에서 동일한 쿼리 파라미터를 사용하면 동기화 문제가 발생할 수 있습니다.
   - 가능하면 상위 컴포넌트에서 쿼리 파라미터를 관리하는 것이 좋습니다.

4. **경로 일치**:

   - 현재 URL 경로가 지정된 경로 패턴과 일치하지 않으면 쿼리 파라미터가 제대로 작동하지 않을 수 있습니다.
   - 항상 현재 페이지에 맞는 경로를 지정해야 합니다.

5. **SearchConfig 의존성**:
   - 쿼리 파라미터를 사용하려면 해당 경로가 `SearchConfig`에 정의되어 있어야 하며, 해당 경로에 쿼리 파라미터가 정의되어 있어야 합니다.
   - 정의되지 않은 파라미터를 사용하면 타입 오류가 발생합니다.
