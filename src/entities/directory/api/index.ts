import { client } from '@/shared/lib/axios/client'

import { DIRECTORY_ENDPOINTS } from './config'

// GET: 모든 디렉토리 조회
export interface GetAllDirectoriesResponse {
  directories: { id: number; name: string; emoji: string; tag: 'DEFAULT' | 'NORMAL'; documentCount: number }[]
}

export const getAllDirectories = async (): Promise<GetAllDirectoriesResponse> => {
  const response = await client.get<GetAllDirectoriesResponse>(DIRECTORY_ENDPOINTS.getAllDirectories())
  return response.data
}

// POST: 디렉토리 생성
interface CreateDirectoryRequest {
  name: string
  emoji: string
}

interface CreateDirectoryResponse {
  id: number
}

export const createDirectory = async (data: CreateDirectoryRequest): Promise<CreateDirectoryResponse> => {
  const response = await client.post<CreateDirectoryResponse>(DIRECTORY_ENDPOINTS.createDirectory(), data)
  return response.data
}

// GET: 단일 디렉토리 조회
interface GetSingleDirectoryResponse {
  id: number
  name: string
  emoji: string
  tag: 'DEFAULT' | 'NORMAL'
}

export const getSingleDirectory = async (directoryId: number): Promise<GetSingleDirectoryResponse> => {
  const response = await client.get<GetSingleDirectoryResponse>(DIRECTORY_ENDPOINTS.getSingleDirectory(directoryId))
  return response.data
}

// DELETE: 디렉토리 삭제
export const deleteDirectory = async (directoryId: number): Promise<void> => {
  const response = await client.delete<void>(DIRECTORY_ENDPOINTS.deleteDirectory(directoryId))
  return response.data
}

// PATCH: 디렉토리 정보 변경
interface UpdateDirectoryInfoRequest {
  name?: string
  emoji?: string
}

export const updateDirectoryInfo = async (directoryId: number, data: UpdateDirectoryInfoRequest): Promise<void> => {
  const response = await client.patch<void>(DIRECTORY_ENDPOINTS.updateDirectoryInfo(directoryId), data)
  return response.data
}
