import { NavigateOptions, useNavigate } from 'react-router'

export const useRouter = () => {
  const navigate = useNavigate()

  const push = (path: string, options?: NavigateOptions) => {
    navigate(path, options)
  }

  const replace = (path: string, options?: NavigateOptions) => {
    navigate(path, { ...options, replace: true })
  }

  const back = () => {
    navigate(-1)
  }

  const forward = () => {
    navigate(1)
  }

  return {
    push,
    replace,
    back,
    forward,
  }
}
