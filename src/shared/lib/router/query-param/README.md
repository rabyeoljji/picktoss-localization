# useQueryParam 훅 사용 가이드

이 문서는 Pick-Toss 애플리케이션의 URL 쿼리 파라미터를 관리하는 `useQueryParam` 훅의 사용법을 설명합니다.

## 목차
1. [기본 사용법](#기본-사용법)
2. [사용했을 때의 장점](#사용했을-때의-장점)
3. [자세한 사용법](#자세한-사용법)
4. [구현 내용](#구현-내용)
5. [주의점](#주의점)
6. [경로별 쿼리 파라미터 설정](#경로별-쿼리-파라미터-설정)

## 기본 사용법

`useQueryParam` 훅은 URL의 쿼리 파라미터를 React 상태처럼 사용할 수 있게 해주는 함수입니다.

```tsx
import { useQueryParam } from '@/shared/lib/router/query-param'

const MyComponent = () => {
  // 기본 사용법
  const [search, setSearch] = useQueryParam('/search', 'q', '')
  
  // 숫자 타입 파라미터
  const [page, setPage] = useQueryParam('/search', 'page', 1)
  
  // 불리언 타입 파라미터
  const [showAll, setShowAll] = useQueryParam('/search', 'showAll', false)
  
  return (
    <div>
      <input 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        placeholder="검색어 입력"
      />
      <button onClick={() => setPage(page + 1)}>다음 페이지</button>
      <label>
        <input 
          type="checkbox" 
          checked={showAll} 
          onChange={() => setShowAll(!showAll)} 
        />
        모두 보기
      </label>
    </div>
  )
}
```

## 사용했을 때의 장점

1. **타입 안전성**:
   - 경로와 쿼리 파라미터 키가 `SearchConfig`에 정의된 값으로 제한됩니다.
   - 초기값의 타입에 따라 반환 타입이 자동으로 결정됩니다.

2. **URL과 상태 동기화**:
   - URL 쿼리 파라미터와 컴포넌트 상태가 자동으로 동기화됩니다.
   - 페이지 새로고침 후에도 상태가 유지됩니다.

3. **사용 편의성**:
   - React의 `useState`와 유사한 API로 쉽게 사용할 수 있습니다.
   - 타입 변환이 자동으로 처리됩니다 (문자열 ↔ 숫자, 문자열 ↔ 불리언).

4. **히스토리 관리 옵션**:
   - 쿼리 파라미터 변경 시 히스토리 항목 추가 여부를 제어할 수 있습니다.
   - 빈 값 처리 방식을 제어할 수 있습니다.

## 자세한 사용법

### 기본 형태

```tsx
const [value, setValue] = useQueryParam(path, key, initialValue, options)
```

- **path**: 경로 문자열 (예: '/search', '/random-quiz')
- **key**: 쿼리 파라미터 키 (예: 'q', 'page')
- **initialValue**: 초기값 (URL에 파라미터가 없을 경우 사용)
- **options**: 옵션 객체 (선택적)

### 타입별 사용법

1. **문자열 파라미터**:
   ```tsx
   const [name, setName] = useQueryParam('/random-quiz', 'name', '')
   ```

2. **숫자 파라미터**:
   ```tsx
   const [page, setPage] = useQueryParam('/search', 'page', 1)
   // URL에 ?page=5가 있으면 page는 숫자 5
   ```

3. **불리언 파라미터**:
   ```tsx
   const [active, setActive] = useQueryParam('/filter', 'active', false)
   // URL에 ?active=true가 있으면 active는 true
   ```

### 옵션 설정

```tsx
const [filter, setFilter] = useQueryParam('/search', 'filter', '', {
  // 브라우저 히스토리에 새 항목을 추가하지 않음 (기본값: false)
  push: false,
  
  // 빈 값 처리 방법 (기본값: 'remove')
  // - 'remove': 빈 값을 URL에서 완전히 제거 (예: ?filter='' → URL에서 제거)
  // - 'preserve': 빈 값을 URL에 유지 (예: ?filter='')
  emptyHandling: 'preserve'
})
```

### 타입 검증

`SearchConfig`에 정의된 경로와 쿼리 파라미터에 대해 타입 검증이 이루어집니다:

```tsx
// '/random-quiz' 경로는 SearchConfig에 'date' 파라미터가 문자열로 정의됨
const [date, setDate] = useQueryParam('/random-quiz', 'date', '')  // 정상 작동

// 'invalid'는 SearchConfig에 정의되지 않은 파라미터
const [invalid, setInvalid] = useQueryParam('/random-quiz', 'invalid', '')  // 타입 오류
```

## 구현 내용

`useQueryParam` 훅은 다음과 같은 기능을 제공합니다:

1. **쿼리 파라미터 추출**:
   - 현재 URL에서 지정된 키의 쿼리 파라미터 값을 추출합니다.
   - URL에 파라미터가 없으면 초기값을 사용합니다.

2. **타입 변환**:
   - 초기값의 타입에 따라 파라미터 값을 적절한 타입으로 변환합니다.
   - 문자열 → 숫자, 문자열 → 불리언 변환을 지원합니다.

3. **값 설정**:
   - 새 값을 설정하면 URL의 쿼리 파라미터가 업데이트됩니다.
   - 옵션에 따라 히스토리 항목 추가 여부와 빈 값 처리 방식이 결정됩니다.

4. **타입 안전성**:
   - TypeScript 오버로딩을 통해 경로와 파라미터에 대한 타입 검증을 제공합니다.
   - 초기값 타입에 따라 반환 타입이 결정됩니다.

## 주의점

1. **경로와 파라미터 순서**:
   - `useQueryParam` 함수의 매개변수 순서는 (경로, 파라미터 키, 초기값, 옵션)입니다.
   - 이전에는 (파라미터 키, 초기값, 경로?) 순서였으나 변경되었습니다.

2. **히스토리 관리**:
   - 기본적으로 `push` 옵션은 `false`로 설정되어 있어 히스토리 항목이 추가되지 않습니다.
   - 필요한 경우 `{ push: true }`로 설정하여 히스토리 항목을 추가할 수 있습니다.

3. **빈 값 처리**:
   - 기본적으로 빈 문자열('')은 URL에서 완전히 제거됩니다.
   - 빈 값을 URL에 유지하려면 `{ emptyHandling: 'preserve' }`로 설정해야 합니다.

4. **타입 제한**:
   - 현재 지원되는 타입은 문자열, 숫자, 불리언입니다.
   - 배열이나 객체는 직접 지원되지 않습니다.

5. **경로 변경 시 동작**:
   - 경로가 변경되면 쿼리 파라미터가 초기화될 수 있습니다.
   - 여러 경로에서 동일한 쿼리 파라미터를 사용하는 경우 주의가 필요합니다.

## 경로별 쿼리 파라미터 설정

### RoutePath와 SearchConfig

`useQueryParam` 훅은 `RoutePath`와 `SearchConfig`를 통해 타입 안전성을 보장합니다. 이 두 객체는 `src/shared/lib/router/config/index.ts` 파일에 정의되어 있습니다.

```tsx
// 경로 정의 예시
export const RoutePath = {
  search: '/search',
  randomQuiz: '/random-quiz',
  // ... 기타 경로들
} as const

// 경로별 검색 파라미터 타입 정의 예시
export const SearchConfig = {
  '/search': {
    q: '',        // 검색어 (문자열)
    filter: '',   // 필터 (문자열)
    page: 0,      // 페이지 번호 (숫자)
    showAll: false // 모두 보기 (불리언)
  },
  '/random-quiz': {
    difficulty: '',  // 난이도 (문자열)
    category: '',    // 카테고리 (문자열)
    count: 0,        // 문제 수 (숫자)
    date: ''         // 날짜 (문자열)
  },
  // ... 기타 경로별 검색 파라미터 정의
} as const
```

### 경로별 쿼리 파라미터 사용 예시

각 경로에 맞는 쿼리 파라미터를 사용하면 타입 검증이 자동으로 이루어집니다:

```tsx
// 검색 페이지에서의 사용 예시
const SearchPage = () => {
  // 타입 안전: '/search' 경로는 'q', 'filter', 'page', 'showAll' 파라미터를 가짐
  const [query, setQuery] = useQueryParam('/search', 'q', '')
  const [filter, setFilter] = useQueryParam('/search', 'filter', '')
  const [page, setPage] = useQueryParam('/search', 'page', 1)
  const [showAll, setShowAll] = useQueryParam('/search', 'showAll', false)
  
  // ...
}

// 랜덤 퀴즈 페이지에서의 사용 예시
const RandomQuizPage = () => {
  // 타입 안전: '/random-quiz' 경로는 'difficulty', 'category', 'count', 'date' 파라미터를 가짐
  const [difficulty, setDifficulty] = useQueryParam('/random-quiz', 'difficulty', '')
  const [category, setCategory] = useQueryParam('/random-quiz', 'category', '')
  const [count, setCount] = useQueryParam('/random-quiz', 'count', 10)
  const [date, setDate] = useQueryParam('/random-quiz', 'date', '')
  
  // ...
}
```

### 새로운 쿼리 파라미터 추가하기

새로운 경로나 쿼리 파라미터를 추가하려면 `SearchConfig` 객체를 업데이트해야 합니다:

```tsx
// 새로운 경로와 쿼리 파라미터 추가 예시
export const SearchConfig = {
  // 기존 설정...
  
  // 새로운 경로와 파라미터 추가
  '/new-feature': {
    mode: '',     // 모드 (문자열)
    enabled: false, // 활성화 여부 (불리언)
    limit: 0      // 제한 (숫자)
  }
} as const
```

이렇게 정의된 쿼리 파라미터는 `useQueryParam` 훅을 통해 타입 안전하게 사용할 수 있습니다.
