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
  // 기본 사용법: [값, 설정 함수, 제거 함수]
  const [search, setSearch, removeSearch] = useQueryParam('/search', 'q')
  
  // 반환되는 타입은 RouteConfig에 정의된 타입에 따라 자동으로 결정됨
  const [name, setName, removeName] = useQueryParam('/progress-quiz/:quizId', 'name')  // '유민' | '정우' 타입
  const [page, setPage, removePage] = useQueryParam('/search', 'page')  // number 타입
  const [showAll, setShowAll, removeShowAll] = useQueryParam('/filter', 'active')  // boolean 타입
  
  // 여러 쿼리 파라미터 관리
  const [params, setParams, removeParams] = useQueryParams('/search')
  
  return (
    <div>
      <input 
        value={search || ''} 
        onChange={(e) => setSearch(e.target.value)} 
        placeholder="검색어 입력"
      />
      <button onClick={() => removeSearch()}>검색어 지우기</button>
      
      <button onClick={() => setPage(page + 1)}>다음 페이지</button>
      <button onClick={() => removePage()}>페이지 초기화</button>
      
      <label>
        <input 
          type="checkbox" 
          checked={showAll} 
          onChange={() => setShowAll(!showAll)} 
        />
        모두 보기
      </label>
      <button onClick={() => removeShowAll()}>필터 초기화</button>
      
      {/* 모든 파라미터 한번에 변경 */}
      <button onClick={() => setParams({ q: '새 검색어', page: 1, showAll: true })}>
        모두 설정
      </button>
      <button onClick={() => removeParams()}>모두 초기화</button>
    </div>
  )
}
```

## 사용했을 때의 장점

1. **타입 안전성**:
   - 경로와 쿼리 파라미터 키가 `RouteConfig`에 정의된 값으로 제한됩니다.
   - 각 경로별로 사용 가능한 쿼리 파라미터와 타입이 자동으로 추론됩니다.
   - `RouteConfig`에 정의된 타입에 따라 반환 타입이 자동으로 결정됩니다.

2. **URL과 상태 동기화**:
   - URL 쿼리 파라미터와 컴포넌트 상태가 자동으로 동기화됩니다.
   - 페이지 새로고침 후에도 상태가 유지됩니다.

3. **사용 편의성**:
   - React의 `useState`와 유사한 API로 쉽게 사용할 수 있습니다.
   - `RouteConfig`에 정의된 타입에 따라 자동으로 타입 변환이 처리됩니다 (문자열 ↔ 숫자, 문자열 ↔ 불리언).
   - 쿼리 파라미터 제거 기능이 내장되어 있어 상태 관리가 용이합니다.

4. **히스토리 관리 옵션**:
   - 쿼리 파라미터 변경 시 히스토리 항목 추가 여부를 제어할 수 있습니다.
   - 빈 값 처리 방식을 제어할 수 있습니다.
   - 개별 작업마다 옵션을 오버라이드할 수 있어 유연하게 사용 가능합니다.

## 자세한 사용법

### 기본 형태

```tsx
const [value, setValue, removeValue] = useQueryParam(path, key, options?)
```

- **path**: 경로 문자열 (예: '/search', '/progress-quiz/:quizId')
- **key**: 쿼리 파라미터 키 (예: 'q', 'page')
- **options**: 옵션 객체 (선택적)

### 타입별 사용법

쿼리 파라미터의 타입은 `RouteConfig`에 정의된 타입에 따라 자동으로 결정됩니다:

1. **문자열 파라미터**:
   ```tsx
   const [name, setName, removeName] = useQueryParam('/progress-quiz/:quizId', 'name')
   // RouteConfig에 name: '유민' as '유민' | '정우'로 정의된 경우, name은 '유민' | '정우' 타입
   ```

2. **숫자 파라미터**:
   ```tsx
   const [page, setPage, removePage] = useQueryParam('/search', 'page')
   // RouteConfig에 page: 0으로 정의된 경우, page는 number 타입
   // URL에 ?page=5가 있으면 page는 숫자 5
   ```

3. **불리언 파라미터**:
   ```tsx
   const [active, setActive, removeActive] = useQueryParam('/filter', 'active')
   // RouteConfig에 active: false로 정의된 경우, active는 boolean 타입
   // URL에 ?active=true가 있으면 active는 true
   ```

### 여러 쿼리 파라미터 관리

```tsx
const [params, setParams, removeParams] = useQueryParams('/search')

// 모든 파라미터 가져오기
console.log(params) // { q: '검색어', page: 1, ... }

// 여러 파라미터 설정
setParams({ q: '새 검색어', page: 1 })

// 특정 파라미터만 제거
removeParams('q') // q 파라미터만 제거
removeParams(['q', 'page']) // q와 page 제거

// 모든 파라미터 제거
removeParams()
```

### 옵션 설정

```tsx
const [filter, setFilter, removeFilter] = useQueryParam('/search', 'filter', {
  // 히스토리 옵션
  push: true, // true: 히스토리에 새 항목 추가, false: 현재 항목을 대체 (기본값: true)
  
  // 빈 값 처리 방법 (기본값: 'remove')
  // - 'remove': 빈 값을 URL에서 완전히 제거 (예: ?filter='' → URL에서 제거)
  // - 'preserve': 빈 값을 URL에 유지 (예: ?filter='')
  emptyHandling: 'preserve'
})
```

### 옵션 오버라이드

설정 및 제거 함수를 호출할 때 옵션을 오버라이드할 수 있습니다:

```tsx
// 값 설정 시 옵션 오버라이드
setFilter('category', { push: false }) // 히스토리 항목을 추가하지 않고 설정

// 제거 시 옵션 오버라이드
removeFilter({ push: false }) // 히스토리 항목을 추가하지 않고 제거

// 여러 파라미터 설정 시 옵션 오버라이드
setParams({ q: '검색어', page: 1 }, { push: false })

// 여러 파라미터 제거 시 옵션 오버라이드
removeParams(['q', 'page'], { push: false })
```

### 타입 검증

`RouteConfig`에 정의된 경로와 쿼리 파라미터에 대해 타입 검증이 이루어집니다:

```tsx
// '/progress-quiz/:quizId' 경로는 RouteConfig에 'name' 파라미터가 문자열로 정의됨
const [name, setName] = useQueryParam('/progress-quiz/:quizId', 'name')  // 정상 작동

// 'invalid'는 RouteConfig에 정의되지 않은 파라미터
const [invalid, setInvalid] = useQueryParam('/progress-quiz/:quizId', 'invalid')  // 타입 오류
```

## 구현 내용

### useQueryParam 훅

`useQueryParam` 훅은 다음과 같은 기능을 제공합니다:

1. **쿼리 파라미터 추출**:
   - 현재 URL에서 지정된 키의 쿼리 파라미터 값을 추출합니다.
   - URL에 파라미터가 없으면 `RouteConfig`에 정의된 초기값을 사용합니다.

2. **타입 변환**:
   - `RouteConfig`에 정의된 타입에 따라 파라미터 값을 적절한 타입으로 변환합니다.
   - 문자열 → 숫자, 문자열 → 불리언 변환을 지원합니다.

3. **값 설정 및 제거**:
   - 새 값을 설정하면 URL의 쿼리 파라미터가 업데이트됩니다.
   - 값을 제거하면 URL에서 해당 쿼리 파라미터가 삭제됩니다.
   - 옵션에 따라 히스토리 항목 추가 여부와 빈 값 처리 방식이 결정됩니다.

4. **타입 안전성**:
   - TypeScript 오버로딩과 조건부 타입을 통해 경로와 파라미터에 대한 타입 검증을 제공합니다.
   - `RouteConfig`에 정의된 타입에 따라 반환 타입이 결정됩니다.

### RouteConfig와 SearchConfig 통합

`useQueryParam` 훅은 라우터 시스템의 `RouteConfig`와 통합되어 타입 안전성을 제공합니다:

```typescript
// RouteConfig에서 검색 파라미터 타입 추출
type SearchConfig = {
  [P in PathWithSearch['path']]: Extract<PathWithSearch, { path: P }>['search']
}

// 경로와 키에 대한 타입 검증
export function useQueryParam<
  R extends keyof SearchConfig,
  K extends keyof SearchConfig[R],
>(
  path: R,
  key: K,
  options?: QueryParamOptions,
): [SearchConfig[R][K], (value: SearchConfig[R][K], overrideOptions?: QueryParamOptions) => void, (overrideOptions?: QueryParamOptions) => void]
```

이러한 통합을 통해:
- 라우터 시스템에 정의된 경로와 검색 파라미터를 재사용합니다.
- 경로나 검색 파라미터가 변경되면 타입 시스템이 관련된 모든 사용처를 자동으로 찾아내어 오류를 방지합니다.
- 중앙 집중식 타입 관리로 유지보수가 용이해집니다.

## 주의점

1. **경로와 파라미터 순서**:
   - `useQueryParam` 함수의 매개변수 순서는 (경로, 파라미터 키, 옵션)입니다.

2. **초기값 설정**:
   - 초기값은 `RouteConfig`에서 자동으로 가져오므로 별도로 제공할 필요가 없습니다.
   - 값이 없는 경우 `RouteConfig`에 정의된 값이 사용됩니다.

3. **히스토리 관리**:
   - 기본적으로 `push` 옵션은 `true`로 설정되어 있어 히스토리 항목이 추가됩니다.
   - 필요한 경우 `{ push: false }`로 설정하여 히스토리 항목이 추가되지 않도록 할 수 있습니다.
   - 개별 작업마다 옵션을 오버라이드할 수 있어 유연하게 사용 가능합니다.

4. **빈 값 처리**:
   - 기본적으로 빈 문자열('')은 URL에서 완전히 제거됩니다 (`emptyHandling: 'remove'`).
   - 빈 값을 URL에 유지하려면 `{ emptyHandling: 'preserve' }`로 설정해야 합니다.

5. **RouteConfig 의존성**:
   - 쿼리 파라미터를 사용하려면 해당 경로가 `RouteConfig`에 정의되어 있어야 하며, `search` 속성에 해당 파라미터가 정의되어 있어야 합니다.
   - 정의되지 않은 파라미터를 사용하면 타입 오류가 발생합니다.
