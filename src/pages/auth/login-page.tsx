import { Link as ReactRouterLink } from 'react-router'

import { useGLogin } from '@/features/auth'

import { IcLogo } from '@/shared/assets/icon'
import { ImgRoundGoogle, ImgRoundKakao, ImgTodayquiz } from '@/shared/assets/images'
import { Text } from '@/shared/components/ui/text'

const LoginPage = () => {
  const { googleLogin, isLoading } = useGLogin()

  return (
    <main className="h-screen bg-surface-1 px-[38px] flex-center flex-col">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid gap-3">
            <ImgTodayquiz className="w-[160px] mx-auto" />
            <IcLogo className="w-[160px] mx-auto" />
          </div>

          <div className="mt-[56px] text-center">
            <Text typo="body-1-medium" color="sub">
              3초만에 픽토스 시작하기
            </Text>
            <div className="grid gap-2 mt-3">
              <GoogleLoginButton onClick={() => googleLogin()} />
              <KakaoLoginButton />
            </div>
            <div className="mt-6">
              <Text typo="caption-medium" color="caption">
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
            </div>
          </div>
        </>
      )}
    </main>
  )
}

export default LoginPage

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <Text typo="body-1-medium" color="sub" className="mt-4">
        로그인 중...
      </Text>
    </div>
  )
}

const GoogleLoginButton = ({ ...props }) => {
  return (
    <button className="h-[44px] relative rounded-full border flex-center bg-white border-gray-100" {...props}>
      <ImgRoundGoogle className="absolute size-[32px] left-2 bottom-1/2 translate-y-1/2" />
      <Text typo="button-2" color="gray-800">
        Google로 로그인
      </Text>
    </button>
  )
}

const KakaoLoginButton = ({ ...props }) => {
  return (
    <button className="h-[44px] relative rounded-full flex-center bg-[#FFE45F]" {...props}>
      <ImgRoundKakao className="absolute size-[32px] left-2 bottom-1/2 translate-y-1/2" />
      <Text typo="button-2" color="gray-800">
        카카오로 로그인
      </Text>
    </button>
  )
}
