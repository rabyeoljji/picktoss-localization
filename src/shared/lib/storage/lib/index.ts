import { type StorageSchema } from '../config'
import { type StorageKeyType } from '../model/type'

/**
 * localStorage 값을 가져오는 함수
 *
 * @param key 스토리지 키
 * @returns 저장된 값 또는 undefined
 */
export function getLocalStorageItem<K extends StorageKeyType>(key: K): StorageSchema[K] | undefined {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : undefined
  } catch (error) {
    console.error(`Failed to get localStorage item for key: ${key}`, error)
    return undefined
  }
}

/**
 * localStorage에 값을 저장하는 함수
 *
 * @param key 스토리지 키
 * @param value 저장할 값
 */
export function setLocalStorageItem<K extends StorageKeyType>(key: K, value: StorageSchema[K]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to set localStorage item for key: ${key}`, error)
  }
}

/**
 * localStorage에서 키를 삭제하는 함수
 *
 * @param key 스토리지 키
 */
export function removeLocalStorageItem(key: StorageKeyType): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove localStorage item for key: ${key}`, error)
  }
}

/**
 * localStorage를 완전히 비우는 함수
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Failed to clear localStorage', error)
  }
}

/**
 * sessionStorage 값을 가져오는 함수
 *
 * @param key 스토리지 키
 * @returns 저장된 값 또는 undefined
 */
export function getSessionStorageItem<K extends StorageKeyType>(key: K): StorageSchema[K] | undefined {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : undefined
  } catch (error) {
    console.error(`Failed to get sessionStorage item for key: ${key}`, error)
    return undefined
  }
}

/**
 * sessionStorage에 값을 저장하는 함수
 *
 * @param key 스토리지 키
 * @param value 저장할 값
 */
export function setSessionStorageItem<K extends StorageKeyType>(key: K, value: StorageSchema[K]): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to set sessionStorage item for key: ${key}`, error)
  }
}

/**
 * sessionStorage에서 키를 삭제하는 함수
 *
 * @param key 스토리지 키
 */
export function removeSessionStorageItem(key: StorageKeyType): void {
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove sessionStorage item for key: ${key}`, error)
  }
}

/**
 * sessionStorage를 완전히 비우는 함수
 */
export function clearSessionStorage(): void {
  try {
    sessionStorage.clear()
  } catch (error) {
    console.error('Failed to clear sessionStorage', error)
  }
}
