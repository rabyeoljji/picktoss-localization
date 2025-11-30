import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import { Link as ReactRouterLink, useSearchParams } from 'react-router'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useGLogin, useKakaoLogin } from '@/features/auth'

import { useVerifyInviteCode } from '@/entities/auth/api/hooks'

import { IcLogo } from '@/shared/assets/icon'
import { ImgRoundGoogle, ImgRoundKakao, ImgSymbol } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import QuestionBox from '@/shared/components/items/question-box-item'
import Loading from '@/shared/components/ui/loading'
import { Text } from '@/shared/components/ui/text'
import { TERMS_URL } from '@/shared/constants/terms-url-with-locale'
import { useRouter } from '@/shared/lib/router'
import { setLocalStorageItem } from '@/shared/lib/storage/lib'
import { useTranslation } from '@/shared/locales/use-translation'

const exampleQuestions = [
  { emoji: '🪶', question: 'etc.login_page.short_strategy_question' },
  { emoji: '👠', question: 'etc.login_page.process_question' },
  { emoji: '💡', question: 'etc.login_page.rawls_question' },
  { emoji: '🚩', question: 'etc.login_page.mitochondria_question' },
  { emoji: '🧠', question: 'etc.login_page.participation_question' },
]

const InviteLoginPage = () => {
  const router = useRouter()
  const { t, currentLanguage } = useTranslation()

  const [searchParams] = useSearchParams()
  const inviteCode = searchParams.get('inviteCode') ?? ''

  const [verifyCode, setVerifyCode] = useState<boolean | null>(null)
  const { mutate: verifyInviteCode, isPending } = useVerifyInviteCode()

  const onLoginSuccess = () => {
    setLocalStorageItem('inviteCode', inviteCode)
  }

  const { googleLogin, isLoading: isGoogleLoading } = useGLogin(onLoginSuccess)
  const { kakaoLogin, isLoading: isKakaoLoading } = useKakaoLogin(onLoginSuccess)

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

  useEffect(() => {
    if (!inviteCode) return

    verifyInviteCode(
      { data: { inviteCode } },
      {
        onSuccess: () => {
          setVerifyCode(true)
        },
        onError: () => {
          setVerifyCode(false)
        },
      },
    )
  }, [inviteCode])

  useEffect(() => {
    if (verifyCode === null) return

    if (!verifyCode) {
      router.replace('/invite/:inviteCode', {
        params: [inviteCode ?? ''],
      })
    }
  }, [verifyCode])

  if (isPending) {
    return <Loading center />
  }

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Header
            className="bg-gray-900 px-[8px]"
            left={<BackButton type="close" className="text-icon-inverse-dim" />}
          />

          <HeaderOffsetLayout className="size-full flex-center flex-col gap-[71.52px]">
            <div className="flex flex-col gap-[32px]">
              <div className="flex-center flex-col gap-[16px]">
                <ImgSymbol className="w-[80px]" />
                <IcLogo className="w-[210px] h-[53.48px] text-icon-inverse" />
              </div>
              <div className="w-full max-w-xl flex flex-col gap-[10px]">
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
                {currentLanguage === 'ko-KR' && <KakaoLoginButton onClick={() => handleLogin('KAKAO')} />}
                <GoogleLoginButton onClick={() => handleLogin('GOOGLE')} />
              </div>

              <div className="text-center">
                <Text typo="caption-medium" color="caption">
                  {t('etc.login_page.login_message')}{' '}
                  <ReactRouterLink
                    to={TERMS_URL.PRIVACY_POLICY[currentLanguage]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {t('etc.login_page.privacy_policy')}
                  </ReactRouterLink>{' '}
                  {t('etc.login_page.and')}{' '}
                  <ReactRouterLink
                    to={TERMS_URL.TERMS_OF_SERVICE[currentLanguage]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {t('etc.login_page.terms_of_service')}
                  </ReactRouterLink>
                  {t('etc.login_page.agreement_message')} <br /> {t('etc.login_page.agreement_description')}
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
    <div className="size-full flex-center flex-col">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <Text typo="body-1-medium" color="sub" className="mt-4">
        {t('etc.login_page.logging_in_message')}
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
        {t('etc.login_page.google_start_button')}
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
        {t('etc.login_page.kakao_start_button')}
      </Text>
    </button>
  )
}

export default withHOC(InviteLoginPage, {
  backgroundClassName: 'bg-gray-900',
})
