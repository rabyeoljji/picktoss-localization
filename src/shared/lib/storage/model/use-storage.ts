import { useEffect, useState } from 'react'

import { StorageSchema } from '../config'
import {
  getLocalStorageItem,
  getSessionStorageItem,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from '../lib'
import { type StorageKeyType } from '../model/type'

/**
 * 로컬 스토리지 사용을 위한 커스텀 훅
 *
 * 키에 해당하는 로컬 스토리지 값을 React state로 관리하고,
 * 값 변경 시 로컬 스토리지에 자동 저장
 *
 * @param key 스토리지 키
 * @param initialValue 초기값 (스토리지에 값이 없을 경우 사용)
 * @returns [값, 값 설정 함수, 값 삭제 함수]
 *
 * @example
 * const [token, setToken, removeToken] = useLocalStorage(StorageKey.token, '')
 */
export function useLocalStorage<K extends StorageKeyType>(
  key: K,
  initialValue: StorageSchema[K],
): [StorageSchema[K], (value: StorageSchema[K]) => void, () => void] {
  // 초기 상태 설정
  const [storedValue, setStoredValue] = useState<StorageSchema[K]>(() => {
    const item = getLocalStorageItem(key)
    return item !== undefined ? item : initialValue
  })

  // 값이 변경될 때 로컬 스토리지 업데이트
  useEffect(() => {
    setLocalStorageItem(key, storedValue)
  }, [key, storedValue])

  // 값 설정 함수
  const setValue = (value: StorageSchema[K]) => {
    setStoredValue(value)
  }

  // 값 삭제 함수
  const removeValue = () => {
    removeLocalStorageItem(key)
    setStoredValue(initialValue)
  }

  return [storedValue, setValue, removeValue]
}

/**
 * 세션 스토리지 사용을 위한 커스텀 훅
 *
 * 키에 해당하는 세션 스토리지 값을 React state로 관리하고,
 * 값 변경 시 세션 스토리지에 자동 저장
 *
 * @param key 스토리지 키
 * @param initialValue 초기값 (스토리지에 값이 없을 경우 사용)
 * @returns [값, 값 설정 함수, 값 삭제 함수]
 *
 * @example
 * const [theme, setTheme, removeTheme] = useSessionStorage(StorageKey.theme, 'light')
 */
export function useSessionStorage<K extends StorageKeyType>(
  key: K,
  initialValue: StorageSchema[K],
): [StorageSchema[K], (value: StorageSchema[K]) => void, () => void] {
  // 초기 상태 설정
  const [storedValue, setStoredValue] = useState<StorageSchema[K]>(() => {
    const item = getSessionStorageItem(key)
    return item !== undefined ? item : initialValue
  })

  // 값이 변경될 때 세션 스토리지 업데이트
  useEffect(() => {
    setSessionStorageItem(key, storedValue)
  }, [key, storedValue])

  // 값 설정 함수
  const setValue = (value: StorageSchema[K]) => {
    setStoredValue(value)
  }

  // 값 삭제 함수
  const removeValue = () => {
    removeSessionStorageItem(key)
    setStoredValue(initialValue)
  }

  return [storedValue, setValue, removeValue]
}
