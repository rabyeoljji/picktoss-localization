import { useEffect } from 'react'
import Marquee from 'react-fast-marquee'
import { Link as ReactRouterLink } from 'react-router'

import { useStore } from 'zustand'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useAuthStore, useGLogin } from '@/features/auth'
import { useKakaoLogin } from '@/features/auth/model/use-k-Login'

import { IcLogo } from '@/shared/assets/icon'
import { ImgRoundGoogle, ImgRoundKakao, ImgSymbol } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import QuestionBox from '@/shared/components/items/question-box-item'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const exampleQuestions = [
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
  { emoji: '👠', question: '프로세스는 무엇인가요?' },
  { emoji: '💡', question: '롤스는 무엇을 주장했나요?' },
  { emoji: '🚩', question: '미토콘드리아에 대한 설명 중 틀린 것은?' },
  { emoji: '🧠', question: '참여가 늘어나는 이유는 무엇인가요?' },
]

const LoginPage = () => {
  const token = useStore(useAuthStore, (state) => state.token)

  const { googleLogin, isLoading: googleLoading } = useGLogin()
  const { kakaoLogin, isLoading: kakaoLoading } = useKakaoLogin()

  const router = useRouter()

  useEffect(() => {
    if (token) {
      // 로그인 상태라면 해당 페이지에 접근하지 못하도록, 메인으로 리다이렉트
      router.replace('/')
    }
  }, [token])

  return (
    <>
      {googleLoading || kakaoLoading ? (
        <div className="size-full flex-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Header
            className="bg-gray-900 px-[8px]"
            left={
              <BackButton
                type="close"
                className="text-icon-inverse-dim"
                onClick={() => {
                  router.replace('/explore')
                }}
              />
            }
          />

          <HeaderOffsetLayout className="size-full flex-center flex-col gap-[71.52px]">
            <div className="flex flex-col gap-[32px]">
              <div className="flex-center flex-col gap-[16px]">
                <ImgSymbol className="w-[80px]" />
                <IcLogo className="w-[210px] h-[53.48px] text-icon-inverse" />
              </div>
              <div className="flex flex-col gap-[10px]">
                <Marquee gradient={false} speed={20} direction="left">
                  {exampleQuestions.map((item, index) => (
                    <QuestionBox
                      key={index}
                      emoji={item.emoji}
                      question={item.question}
                      color="dark"
                      className="mr-[8px]"
                    />
                  ))}
                </Marquee>
                <Marquee gradient={false} speed={20} direction="right">
                  {exampleQuestions.map((item, index) => (
                    <QuestionBox
                      key={index}
                      emoji={item.emoji}
                      question={item.question}
                      color="dark"
                      className="mr-[8px]"
                    />
                  ))}
                </Marquee>
              </div>
            </div>

            <div className="w-full flex-center flex-col gap-[16px]">
              <div className="w-full flex flex-col gap-2 px-[32px]">
                <KakaoLoginButton onClick={() => kakaoLogin()} />
                <GoogleLoginButton onClick={() => googleLogin()} />
              </div>

              <div className="text-center">
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
                  에 동의하는 것으로 <br /> 간주하며, 서비스 이용을 위해 이메일과 이름을 수집합니다.
                </Text>
              </div>
            </div>
          </HeaderOffsetLayout>
        </>
      )}
    </>
  )
}

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
    <button
      className="h-[48px] relative rounded-full border flex-center bg-white border-gray-100 active:bg-gray-50"
      {...props}
    >
      <ImgRoundGoogle className="absolute size-[36px] left-2 bottom-1/2 translate-y-1/2" />
      <Text typo="button-3" color="gray-800">
        Google로 시작하기
      </Text>
    </button>
  )
}

const KakaoLoginButton = ({ ...props }) => {
  return (
    <button className="h-[48px] relative rounded-full flex-center bg-[#FFE45F] active:opacity-90" {...props}>
      <ImgRoundKakao className="absolute size-[36px] left-2 bottom-1/2 translate-y-1/2" />
      <Text typo="button-3" color="gray-800">
        카카오로 시작하기
      </Text>
    </button>
  )
}

export default withHOC(LoginPage, {
  backgroundClassName: 'bg-gray-900',
})
