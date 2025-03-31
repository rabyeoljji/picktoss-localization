# 타입 안전한 라우팅 시스템 가이드

이 문서는 Pick-Toss 애플리케이션의 타입 안전한 라우팅 시스템인 `useRouter` 훅과 `Link` 컴포넌트의 사용법을 설명합니다.

## 목차

1. [기본 사용법](#기본-사용법)
2. [사용했을 때의 장점](#사용했을-때의-장점)
3. [자세한 사용법](#자세한-사용법)
4. [구현 내용](#구현-내용)
5. [주의점](#주의점)
6. [경로 및 검색 파라미터 설정](#경로-및-검색-파라미터-설정)

## 기본 사용법

### useRouter 훅

```tsx
import { useRouter } from '@/shared/lib/router'

const MyComponent = () => {
  const router = useRouter()

  const handleClick = () => {
    // 기본 페이지 이동
    router.push('/account')

    // 쿼리 파라미터와 함께 이동
    router.push('/account', { search: { tab: 'profile' } })

    // 경로 파라미터가 있는 페이지로 이동
    router.push('/note/:noteId', { params: ['123'] })
  }

  return <button onClick={handleClick}>이동</button>
}
```

### Link 컴포넌트

```tsx
import { Link } from '@/shared/lib/router'

const MyComponent = () => {
  return (
    <div>
      {/* 기본 링크 */}
      <Link to="/account">계정</Link>

      {/* 쿼리 파라미터와 함께 */}
      <Link to="/account" search={{ tab: 'profile' }}>
        프로필
      </Link>

      {/* 경로 파라미터가 있는 링크 */}
      <Link to="/note/:noteId" params={['123']}>
        노트 123
      </Link>
    </div>
  )
}
```

## 사용했을 때의 장점

1. **타입 안전성**:

   - 경로가 `RouteConfig`에 정의된 값으로 제한됩니다.
   - 경로 파라미터가 필요한 경로에는 `params` 속성이 필수입니다.
   - 쿼리 파라미터는 `RouteConfig`에 정의된 `search` 타입에 따라 검증됩니다.

2. **자동 완성 지원**:

   - 경로 입력 시 IDE에서 자동 완성을 제공합니다.
   - 경로에 따라 필요한 파라미터가 자동으로 제안됩니다.
   - 각 경로별 검색 파라미터의 타입이 자동으로 제안됩니다.

3. **일관된 URL 생성**:

   - 모든 URL 생성이 `buildUrl` 함수를 통해 일관되게 처리됩니다.
   - 경로 파라미터, 쿼리 파라미터, 해시 등이 올바르게 조합됩니다.

4. **리팩토링 용이성**:
   - 경로가 변경되면 타입 시스템이 관련된 모든 사용처를 찾아냅니다.
   - 중앙 집중식 경로 관리로 유지보수가 쉬워집니다.
   - 검색 파라미터 타입이 자동으로 추출되어 유지보수가 간편합니다.

## 자세한 사용법

### useRouter 훅

`useRouter` 훅은 다음과 같은 메서드를 제공합니다:

1. **push**: 새 주소로 이동하고 히스토리에 추가합니다.

   ```tsx
   // 기본 이동
   router.push('/account')

   // 쿼리 파라미터와 함께
   router.push('/search', { search: { q: '검색어', filter: 'all' } })

   // 해시와 함께
   router.push('/note/:noteId', { params: ['123'], hash: 'comments' })
   ```

2. **replace**: 현재 주소를 대체하여 이동합니다 (히스토리에 추가되지 않음).

   ```tsx
   // 현재 페이지를 대체
   router.replace('/account')

   // 쿼리 파라미터와 함께
   router.replace('/search', { search: { q: '검색어' } })
   ```

3. **back**: 브라우저 히스토리에서 뒤로 이동합니다.

   ```tsx
   router.back()
   ```

4. **forward**: 브라우저 히스토리에서 앞으로 이동합니다.
   ```tsx
   router.forward()
   ```

### Link 컴포넌트

`Link` 컴포넌트는 다음과 같은 속성을 지원합니다:

1. **to**: 이동할 경로 (필수)

   ```tsx
   <Link to="/account">계정</Link>
   ```

2. **params**: 경로 파라미터 (경로에 파라미터가 있는 경우 필수)

   ```tsx
   <Link to="/note/:noteId" params={['123']}>노트 123</Link>
   <Link to="/progress-quiz/:quizId" params={['3']}>퀴즈 3</Link>
   ```

3. **search**: 쿼리 파라미터 (선택적)

   ```tsx
   // 객체 형태
   <Link to="/search" search={{ q: '검색어', filter: 'all' }}>검색</Link>

   // 문자열 형태
   <Link to="/search" search="q=검색어&filter=all">검색</Link>
   ```

4. **hash**: URL 해시 (선택적)

   ```tsx
   <Link to="/note/:noteId" params={['123']} hash="comments">
     댓글로 이동
   </Link>
   ```

5. **기타 속성**: React Router의 `Link` 컴포넌트가 지원하는 모든 속성
   ```tsx
   <Link to="/account" className="btn" onClick={handleClick}>
     계정
   </Link>
   ```

## 구현 내용

### RouteConfig와 SearchConfig

1. **RouteConfig**: 애플리케이션의 모든 경로와 관련 설정을 정의합니다.

   ```typescript
   export const RouteConfig = {
     root: {
       pathname: '/',
     },
     login: {
       pathname: '/login',
     },
     noteDetail: {
       pathname: '/note/:noteId',
     },
     progressQuiz: {
       pathname: '/progress-quiz/:quizId',
       search: {
         name: '유민' as '유민' | '정우',
         emoji: '',
         date: '',
       },
     },
     // ... 기타 경로들
   }
   ```

2. **SearchConfig**: `RouteConfig`에서 자동으로 생성되는 검색 파라미터 매핑입니다.

   ```typescript
   // 타입 추출 및 매핑을 위한 유틸리티 타입
   type PathWithSearch = {
     [K in keyof typeof RouteConfig]: (typeof RouteConfig)[K] extends { pathname: infer P; search: infer S }
       ? P extends string
         ? { path: P; search: S }
         : never
       : never
   }[keyof typeof RouteConfig]

   // 경로별 검색 파라미터 매핑 생성
   export const SearchConfig = Object.fromEntries(
     Object.entries(RouteConfig).flatMap(([_, value]) => {
       if ('search' in value) {
         return [[value.pathname, value.search]]
       }
       return []
     }),
   ) as {
     [P in PathWithSearch['path']]: Extract<PathWithSearch, { path: P }>['search']
   }
   ```

### useRouter 훅

`useRouter` 훅은 React Router의 `useNavigate`를 확장하여 타입 안전한 라우팅을 제공합니다:

1. **타입 체크**: 경로와 파라미터에 대한 타입 검증을 수행합니다.
2. **URL 생성**: `buildUrl` 함수를 사용하여 일관된 URL을 생성합니다.
3. **네비게이션 함수**: `push`, `replace`, `back`, `forward` 함수를 제공합니다.

### Link 컴포넌트

`Link` 컴포넌트는 React Router의 `Link`를 확장하여 타입 안전한 링크를 제공합니다:

1. **타입 체크**: 경로와 파라미터에 대한 타입 검증을 수행합니다.
2. **URL 생성**: `buildUrl` 함수를 사용하여 일관된 URL을 생성합니다.
3. **조건부 속성**: 경로에 파라미터가 있는지에 따라 다른 속성을 요구합니다.

## 주의점

1. **경로 파라미터 타입**:

   - 모든 경로 파라미터는 문자열(`string`)로 전달해야 합니다.
   - 숫자를 전달할 경우 문자열로 변환해야 합니다: `params={['123']}` (O), `params={[123]}` (X)

2. **경로 정의**:

   - 모든 경로는 `RouteConfig`에 정의되어 있어야 합니다.
   - 정의되지 않은 경로를 사용하면 타입 오류가 발생합니다.

3. **쿼리 파라미터 타입**:

   - 쿼리 파라미터는 `RouteConfig`의 `search` 속성에 정의된 타입에 따라 검증됩니다.
   - 정의되지 않은 쿼리 파라미터를 사용하면 타입 오류가 발생할 수 있습니다.

4. **경로 파라미터 순서**:

   - 경로 파라미터는 경로에 정의된 순서대로 전달해야 합니다.
   - 예: `/user/:userId/post/:postId`에는 `params={['123', '456']}`와 같이 전달해야 합니다.

5. **히스토리 관리**:
   - `push`는 새 히스토리 항목을 생성하고, `replace`는 현재 항목을 대체합니다.
   - 사용자 경험을 고려하여 적절한 메서드를 선택해야 합니다.

## 경로 및 검색 파라미터 설정

### RouteConfig

`RouteConfig`는 애플리케이션의 모든 경로와 관련 설정을 정의하는 객체입니다:

```typescript
export const RouteConfig = {
  root: {
    pathname: '/',
  },
  login: {
    pathname: '/login',
  },
  search: {
    pathname: '/search',
    search: {
      q: '',
      filter: '',
      page: 0,
    },
  },
  noteDetail: {
    pathname: '/note/:noteId',
    search: {
      tab: '',
    },
  },
  // ... 기타 경로들
}
```

특징:

- 각 경로는 고유한 키(예: 'root', 'login')를 가집니다.
- 각 항목은 `pathname` 속성을 필수로 가집니다.
- 쿼리 파라미터가 필요한 경로는 `search` 속성을 추가로 가집니다.
- `search` 속성의 값 타입이 해당 경로의 쿼리 파라미터 타입을 결정합니다.

### SearchConfig

`SearchConfig`는 `RouteConfig`에서 자동으로 생성되는 검색 파라미터 매핑입니다:

```typescript
// 경로별 검색 파라미터 매핑 예시
{
  '/': undefined,
  '/login': undefined,
  '/search': { q: '', filter: '', page: 0 },
  '/note/:noteId': { tab: '' },
  // ... 기타 경로들
}
```

특징:

- 경로 문자열(pathname)을 키로 사용합니다.
- `RouteConfig`에서 `search` 속성이 있는 항목만 포함됩니다.
- 이 객체는 `useQueryParam` 훅에서 타입 추론의 기반으로 사용됩니다.
