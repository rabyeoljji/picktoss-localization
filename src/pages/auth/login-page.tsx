import { Navigate, Link as ReactRouterLink } from 'react-router'

import { useAuthStore, useGLogin } from '@/features/auth'

import { IcLogo } from '@/shared/assets/icon'
import { ImgTodayquiz } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'

const LoginPage = () => {
  const token = useAuthStore((state) => state.token)

  const { googleLogin } = useGLogin()

  if (token) {
    // return <Navigate to="/" />
  }

  return (
    <main className="flex-center relative z-20 h-[calc(100dvh-54px)] w-full flex-col overflow-y-auto overflow-x-hidden bg-background-base-01 px-[43px] scrollbar-hide">
      <ImgTodayquiz className="w-[160px]" />

      <IcLogo className="w-[102px]" />

      <Text typo="subtitle-2-medium">3초만에 픽토스 시작하기</Text>

      <div className="grid gap-3 w-full">
        <Button className="bg-gray-300" onClick={() => googleLogin()}>
          Google로 로그인
        </Button>
        <Button className="bg-[#FBE44D] hover:[#FBE44D] active:[#FBE44D]">카카오로 로그인</Button>
      </div>

      <Text typo="caption-medium" color="caption" className="text-center mt-4">
        로그인 시{' '}
        <ReactRouterLink
          to="https://picktoss.notion.site/1209d818f56080fbb469e82def758e9c?pvs=4"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          개인정보보호 정책
        </ReactRouterLink>{' '}
        및{' '}
        <ReactRouterLink
          to="https://picktoss.notion.site/1209d818f560809aad11c5b64020d735?pvs=4"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          서비스 이용약관
        </ReactRouterLink>
        에 동의하는 것으로 간주하며, 서비스 이용을 위해 이메일과 이름을 수집합니다.
      </Text>
    </main>
  )
}

export default LoginPage
