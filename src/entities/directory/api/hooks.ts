import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { DIRECTORY_KEYS } from './config'
import { createDirectory, deleteDirectory, getAllDirectories, getSingleDirectory, updateDirectoryInfo } from './index'

// GET: 모든 디렉토리 조회
export const useGetAllDirectories = () => {
  return useQuery({
    queryKey: [DIRECTORY_KEYS.getAllDirectories],
    queryFn: () => getAllDirectories(),
    select: (data) => data.directories,
  })
}

// POST: 디렉토리 생성
export const useCreateDirectory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: DIRECTORY_KEYS.createDirectory,
    mutationFn: (data: Parameters<typeof createDirectory>[0]) => createDirectory(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [DIRECTORY_KEYS.getAllDirectories] })
    },
  })
}

// GET: 단일 디렉토리 조회
export const useGetSingleDirectory = (directoryId: number) => {
  return useQuery({
    queryKey: [DIRECTORY_KEYS.getSingleDirectory(directoryId)],
    queryFn: () => getSingleDirectory(directoryId),
  })
}

// DELETE: 디렉토리 삭제
export const useDeleteDirectory = (directoryId: number) => {
  return useMutation({
    mutationKey: DIRECTORY_KEYS.deleteDirectory(directoryId),
    mutationFn: () => deleteDirectory(directoryId),
  })
}

// PATCH: 디렉토리 정보 변경
export const useUpdateDirectoryInfo = (directoryId: number) => {
  return useMutation({
    mutationKey: DIRECTORY_KEYS.updateDirectoryInfo(directoryId),
    mutationFn: (data: Parameters<typeof updateDirectoryInfo>[1]) => updateDirectoryInfo(directoryId, data),
  })
}
