import type { StorageKey, StorageSchema } from '../config'

/**
 * 스토리지 키 타입
 * 모든 스토리지 키 문자열 리터럴의 유니온 타입
 */
export type StorageKeyType = keyof typeof StorageKey & keyof StorageSchema

/**
 * 스토리지 값 타입
 * 스토리지 키를 사용하여 해당 값의 타입을 조회
 */
export type StorageValue<K extends StorageKeyType> = StorageSchema[K]
