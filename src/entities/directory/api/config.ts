import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

const DIRECTORY = 'directory'

export const DIRECTORY_ENDPOINTS = {
  getAllDirectories: () => '/directories',
  createDirectory: () => '/directories',
  getSingleDirectory: (directoryId: number) => `/directories/${directoryId}`,
  deleteDirectory: (directoryId: number) => `/directories/${directoryId}`,
  updateDirectoryInfo: (directoryId: number) => `/directories/${directoryId}/update-info`,
}

export const DIRECTORY_KEYS = {
  getAllDirectories: originalCreateKey(DIRECTORY, DIRECTORY_ENDPOINTS.getAllDirectories()),
  createDirectory: originalCreateKey(DIRECTORY, DIRECTORY_ENDPOINTS.createDirectory()),
  getSingleDirectory: (directoryId: number) =>
    originalCreateKey(DIRECTORY, DIRECTORY_ENDPOINTS.getSingleDirectory(directoryId)),
  deleteDirectory: (directoryId: number) =>
    originalCreateKey(DIRECTORY, DIRECTORY_ENDPOINTS.deleteDirectory(directoryId)),
  updateDirectoryInfo: (directoryId: number) =>
    originalCreateKey(DIRECTORY, DIRECTORY_ENDPOINTS.updateDirectoryInfo(directoryId)),
}
