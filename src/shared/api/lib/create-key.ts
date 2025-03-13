export const createKey = <T extends readonly unknown[]>(key: string, ...args: T) => {
  return [key, ...args] as const
}
