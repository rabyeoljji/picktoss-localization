import { useEffect } from 'react'
import Marquee from 'react-fast-marquee'
import { Link as ReactRouterLink } from 'react-router'

import { useStore } from 'zustand'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useAuthStore, useGLogin, useKakaoLogin } from '@/features/auth'

import { IcLogo } from '@/shared/assets/icon'
import { ImgRoundGoogle, ImgRoundKakao, ImgSymbol } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import QuestionBox from '@/shared/components/items/question-box-item'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

const exampleQuestions = [
  { emoji: '🪶', question: '숏_전략은_매수하는_전략이다' },
  { emoji: '👠', question: '프로세스는_무엇인가요' },
  { emoji: '💡', question: '롤스는_무엇을_주장했나요' },
  { emoji: '🚩', question: '미토콘드리아에_대한_설명_중_틀린_것은' },
  { emoji: '🧠', question: '참여가_늘어나는_이유는_무엇인가요' },
]

const LoginPage = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const token = useStore(useAuthStore, (state) => state.token)

  const { googleLogin, isLoading: isGoogleLoading } = useGLogin()
  const { kakaoLogin, isLoading: isKakaoLoading } = useKakaoLogin()

  useEffect(() => {
    if (token) {
      // 로그인 상태라면 해당 페이지에 접근하지 못하도록, 메인으로 리다이렉트
      router.replace('/')
    }
  }, [token])

  const isLoading = isGoogleLoading || isKakaoLoading

  const handleLogin = (platform: 'GOOGLE' | 'KAKAO') => {
    try {
      if (platform === 'GOOGLE') {
        googleLogin()
      } else if (platform === 'KAKAO') {
        kakaoLogin()
      }
    } catch (error) {
      // window.location.reload()
      console.error('로그인 실패:', error)
    }
  }

  return (
    <>
      {isLoading ? (
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
                      question={t(item.question)}
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
                      question={t(item.question)}
                      color="dark"
                      className="mr-[8px]"
                    />
                  ))}
                </Marquee>
              </div>
            </div>

            <div className="w-full flex-center flex-col gap-[16px]">
              <div className="w-full flex flex-col gap-2 px-[32px]">
                <KakaoLoginButton onClick={() => handleLogin('KAKAO')} />
                <GoogleLoginButton onClick={() => handleLogin('GOOGLE')} />
              </div>

              <div className="text-center">
                <Text typo="caption-medium" color="caption">
                  {t('etc.로그인_시')}{' '}
                  <ReactRouterLink
                    to="https://picktoss.notion.site/1209d818f56080fbb469e82def758e9c?pvs=4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {t('etc.개인정보보호_정책')}
                  </ReactRouterLink>{' '}
                  {t('etc.및')}{' '}
                  <ReactRouterLink
                    to="https://picktoss.notion.site/1209d818f560809aad11c5b64020d735?pvs=4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {t('etc.서비스_이용약관')}
                  </ReactRouterLink>
                  {t('etc.에_동의하는_것으로')} <br /> {t('etc.간주하며_서비스_이용을_위해_이메일과_이름을_수집합니다')}
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
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <Text typo="body-1-medium" color="sub" className="mt-4">
        {t('etc.로그인_중')}
      </Text>
    </div>
  )
}

const GoogleLoginButton = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <button
      className="h-[48px] relative rounded-full border flex-center bg-white border-gray-100 active:bg-gray-50"
      {...props}
    >
      <ImgRoundGoogle className="absolute size-[36px] left-2 bottom-1/2 translate-y-1/2" />
      <Text typo="button-3" color="gray-800">
        {t('etc.Google로_시작하기')}
      </Text>
    </button>
  )
}

const KakaoLoginButton = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <button className="h-[48px] relative rounded-full flex-center bg-[#FFE45F] active:opacity-90" {...props}>
      <ImgRoundKakao className="absolute size-[36px] left-2 bottom-1/2 translate-y-1/2" />
      <Text typo="button-3" color="gray-800">
        {t('etc.카카오로_시작하기')}
      </Text>
    </button>
  )
}

export default withHOC(LoginPage, {
  backgroundClassName: 'bg-gray-900',
})
