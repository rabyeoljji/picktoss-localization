# 타입 안전한 스토리지 시스템 가이드

이 문서는 Pick-Toss 애플리케이션의 타입 안전한 스토리지 시스템인 `useLocalStorage`와 `useSessionStorage` 훅의 사용법을 설명합니다.

## 목차

1. [기본 사용법](#기본-사용법)
2. [사용했을 때의 장점](#사용했을-때의-장점)
3. [자세한 사용법](#자세한-사용법)
4. [구현 내용](#구현-내용)
5. [주의점](#주의점)

## 기본 사용법

### useLocalStorage 훅

```tsx
import { StorageKey, useLocalStorage } from '@/shared/lib/storage'

const MyComponent = () => {
  // 최근 검색어 목록을 로컬 스토리지에서 관리
  const [recentSearches, setRecentSearches, removeRecentSearches] = useLocalStorage(
    StorageKey.exploreRecentSearchKeyword,
    [],
  )

  const addSearchKeyword = (keyword: string) => {
    // 중복 제거 후 최신 검색어를 맨 앞에 추가
    const updatedSearches = [keyword, ...recentSearches.filter((item) => item !== keyword)].slice(0, 10) // 최대 10개만 유지

    setRecentSearches(updatedSearches)
  }

  const clearSearchHistory = () => {
    removeRecentSearches() // 검색 기록 삭제
  }

  return (
    <div>
      <input
        type="text"
        placeholder="검색어 입력"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addSearchKeyword(e.currentTarget.value)
          }
        }}
      />
      <button onClick={clearSearchHistory}>검색 기록 삭제</button>

      <ul>
        {recentSearches.map((keyword, index) => (
          <li key={index}>{keyword}</li>
        ))}
      </ul>
    </div>
  )
}
```

### useSessionStorage 훅

```tsx
import { StorageKey, useSessionStorage } from '@/shared/lib/storage'

const ThemeToggle = () => {
  // 테마 설정을 세션 스토리지에서 관리
  const [theme, setTheme] = useSessionStorage(StorageKey.theme, 'light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return <button onClick={toggleTheme}>현재 테마: {theme}</button>
}
```

## 사용했을 때의 장점

1. **타입 안전성**:

   - 스토리지 키가 `StorageKey` 상수에 정의된 값으로 제한됩니다.
   - 각 키에 저장되는 값의 타입이 `StorageSchema`에 정의되어 있어 타입 오류를 방지합니다.

2. **React 상태와 스토리지 동기화**:

   - React 상태와 스토리지 값이 자동으로 동기화됩니다.
   - 컴포넌트 간에 스토리지 값을 일관되게 공유할 수 있습니다.

3. **에러 처리**:

   - 스토리지 작업 중 발생할 수 있는 예외를 내부적으로 처리합니다.
   - 스토리지 용량 초과, JSON 파싱 오류 등의 문제를 안전하게 처리합니다.

4. **초기값 지원**:

   - 스토리지에 값이 없을 경우 제공된 초기값을 사용합니다.
   - 애플리케이션 첫 실행 시에도 안정적으로 동작합니다.

5. **값 삭제 기능**:
   - 스토리지에서 값을 쉽게 삭제할 수 있는 함수를 제공합니다.
   - 사용자 데이터 초기화, 로그아웃 등의 기능 구현이 용이합니다.

## 자세한 사용법

### 스토리지 키 정의

모든 스토리지 키는 `StorageKey` 상수에 정의되어 있습니다:

```tsx
// src/shared/lib/storage/config/index.ts
export const StorageKey = {
  exploreRecentSearchKeyword: 'exploreRecentSearchKeyword',
  libraryRecentSearchKeyword: 'libraryRecentSearchKeyword',
  // 새로운 키를 여기에 추가
} as const
```

### 스토리지 값 타입 정의

각 키에 저장되는 값의 타입은 `StorageSchema` 인터페이스에 정의되어 있습니다:

```tsx
// src/shared/lib/storage/config/index.ts
export interface StorageSchema {
  [StorageKey.exploreRecentSearchKeyword]: string[]
  [StorageKey.libraryRecentSearchKeyword]: string[]
  // 새로운 키의 값 타입을 여기에 추가
}
```

### useLocalStorage 훅

`useLocalStorage` 훅은 다음과 같은 형태로 사용합니다:

```tsx
const [value, setValue, removeValue] = useLocalStorage(key, initialValue)
```

- **value**: 현재 저장된 값
- **setValue**: 값을 업데이트하는 함수
- **removeValue**: 값을 삭제하는 함수

### useSessionStorage 훅

`useSessionStorage` 훅은 `useLocalStorage`와 동일한 API를 제공하지만, 세션 스토리지를 사용합니다:

```tsx
const [value, setValue, removeValue] = useSessionStorage(key, initialValue)
```

### 직접 스토리지 접근

훅을 사용하지 않고 직접 스토리지에 접근해야 하는 경우, 다음 함수들을 사용할 수 있습니다:

```tsx
import {
  clearLocalStorage,
  clearSessionStorage,
  getLocalStorageItem,
  getSessionStorageItem,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from '@/shared/lib/storage'

// 로컬 스토리지 사용
const searches = getLocalStorageItem(StorageKey.exploreRecentSearchKeyword)
setLocalStorageItem(StorageKey.exploreRecentSearchKeyword, ['검색어1', '검색어2'])
removeLocalStorageItem(StorageKey.exploreRecentSearchKeyword)
clearLocalStorage() // 모든 로컬 스토리지 항목 삭제

// 세션 스토리지 사용
const theme = getSessionStorageItem(StorageKey.theme)
setSessionStorageItem(StorageKey.theme, 'dark')
removeSessionStorageItem(StorageKey.theme)
clearSessionStorage() // 모든 세션 스토리지 항목 삭제
```

## 구현 내용

### 스토리지 키 및 값 타입

1. **StorageKey**: 모든 스토리지 키를 상수로 정의합니다.
2. **StorageSchema**: 각 키에 저장되는 값의 타입을 정의합니다.
3. **StorageKeyType**: 모든 스토리지 키 문자열 리터럴의 유니온 타입입니다.
4. **StorageValue**: 스토리지 키를 사용하여 해당 값의 타입을 조회하는 타입입니다.

### 스토리지 유틸리티 함수

1. **getLocalStorageItem**: 로컬 스토리지에서 값을 가져옵니다.
2. **setLocalStorageItem**: 로컬 스토리지에 값을 저장합니다.
3. **removeLocalStorageItem**: 로컬 스토리지에서 키를 삭제합니다.
4. **clearLocalStorage**: 모든 로컬 스토리지 항목을 삭제합니다.
5. **getSessionStorageItem**: 세션 스토리지에서 값을 가져옵니다.
6. **setSessionStorageItem**: 세션 스토리지에 값을 저장합니다.
7. **removeSessionStorageItem**: 세션 스토리지에서 키를 삭제합니다.
8. **clearSessionStorage**: 모든 세션 스토리지 항목을 삭제합니다.

### 스토리지 훅

1. **useLocalStorage**: 로컬 스토리지 값을 React 상태로 관리합니다.
2. **useSessionStorage**: 세션 스토리지 값을 React 상태로 관리합니다.

## 주의점

1. **저장 데이터 크기**:

   - 브라우저 스토리지는 용량 제한이 있습니다(일반적으로 5-10MB).
   - 대용량 데이터는 스토리지에 저장하지 않도록 주의해야 합니다.

2. **직렬화 제한**:

   - 스토리지에는 JSON으로 직렬화 가능한 데이터만 저장할 수 있습니다.
   - 함수, 순환 참조, `undefined` 등은 저장할 수 없습니다.

3. **보안 고려사항**:

   - 민감한 정보(비밀번호, 토큰 등)는 가능한 스토리지에 저장하지 않는 것이 좋습니다.
   - 필요한 경우 암호화하여 저장하는 것을 고려해야 합니다.

4. **동기화 문제**:

   - 여러 탭에서 동일한 스토리지 키를 사용할 경우 동기화 문제가 발생할 수 있습니다.
   - 중요한 데이터의 경우 `storage` 이벤트를 활용하여 탭 간 동기화를 구현할 수 있습니다.

5. **스토리지 키 관리**:
   - 새로운 스토리지 키를 추가할 때는 반드시 `StorageKey` 상수와 `StorageSchema` 인터페이스에 함께 추가해야 합니다.
   - 키 이름은 명확하고 구체적으로 지정하여 다른 키와 충돌하지 않도록 해야 합니다.
