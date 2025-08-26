import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { useKakaoSDK } from '@/features/invite/hooks/use-kakao-sdk'
import { shareToKakao } from '@/features/invite/utils/kakao'
import { nativeShare } from '@/features/invite/utils/share'

import { useCreateInviteLink } from '@/entities/auth/api/hooks'

import { IcUpload } from '@/shared/assets/icon'
import { ImgRoundKakao, ImgTreasurebox } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/shared/components/ui/drawer'
import { Input } from '@/shared/components/ui/input'
import { SquareButton } from '@/shared/components/ui/square-button'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useTranslation } from '@/shared/locales/use-translation'

// TODO: 내용 수정
const inviteText = {
  title: '지금 가입하고 별 50개 더 받으세요!',
  description:
    '픽토스에서는 AI퀴즈로 매일 간단하게 내가 배운 걸 기억할 수 있어요. 이 초대권을 통해 픽토스에 가입하실 경우 두 분 모두에게 퀴즈를 만들 수 있는 별 50개를 추가로 드려요!',
}

interface Props {
  triggerComponent: React.ReactNode
  open?: boolean
  onOpenChange?: (value: boolean) => void
}

const InviteDrawer = ({ triggerComponent, open, onOpenChange }: Props) => {
  const { trackEvent } = useAmplitude()
  const { t } = useTranslation()

  // 외부 제어 여부 확인 (controlled vs uncontrolled)
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(false) // 내부 상태는 uncontrolled 모드에서만 사용
  const isOpen = isControlled ? open : internalOpen

  const { mutate: inviteLinkMutate } = useCreateInviteLink()

  const [inviteLink, setInviteLink] = useState('')
  const { isLoaded: isKakaoSDKLoaded, error: kakaoSDKError } = useKakaoSDK()

  const handleOpenChange = (value: boolean) => {
    // uncontrolled 모드일 때만 내부 상태 업데이트
    if (!isControlled) {
      setInternalOpen(value)
    }

    // 외부 제어일 경우, 부모에게 상태 변경 알림
    if (onOpenChange) {
      onOpenChange(value)
    }
  }

  // 카카오톡에 공유
  const handleKakaoShare = async () => {
    if (!isKakaoSDKLoaded || kakaoSDKError) {
      console.error('Kakao SDK 로드 실패:', kakaoSDKError)
      return
    }

    trackEvent('invite_share_click', { method: '카카오톡' })

    try {
      const imageUrl = `${window.location.origin}images/kakao-share-thumbnail.png`

      await shareToKakao({
        title: t('profile.지금_가입하고_별_50개_더_받으세요'),
        description: inviteText.description,
        imageUrl: imageUrl,
        inviteLinkUrl: inviteLink,
      })
    } catch (error) {
      console.error('공유하기 실패:', error)
    }
  }

  // 기본 공유하기
  const handleNativeShare = async () => {
    const content = {
      title: inviteText.title,
      text: inviteText.description,
      url: inviteLink,
    }

    trackEvent('invite_share_click', { method: '일반 공유' })

    // fallback: 공유 API를 지원하지 않는 환경에서는 클립보드에 복사
    await nativeShare(content, handleCopy)
  }

  const handleCopy = async () => {
    if (!inviteLink) return

    trackEvent('invite_share_click', { method: '복사' })

    try {
      await navigator.clipboard.writeText(inviteLink)

      toast(t('profile.링크가_복사되었어요'))
    } catch (error) {
      console.error(error)
    }
  }

  // Drawer가 열릴 때마다 링크 발급
  useEffect(() => {
    if (isOpen) {
      inviteLinkMutate(undefined, {
        onSuccess: (data) => {
          setInviteLink(data.inviteLink)
        },
      })
    }
  }, [isOpen])

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild className="cursor-pointer">
        {triggerComponent}
      </DrawerTrigger>

      <DrawerContent height="lg" className="flex flex-col">
        <div className="my-[20px] flex items-center h-[calc(80dvh-12px)] w-full flex-col gap-[24px] overflow-y-auto">
          <DrawerHeader className="flex h-fit w-full flex-col items-center gap-[24px] px-0">
            <ImgTreasurebox width={140} height={140} />

            <div className="flex flex-col items-center gap-[8px]">
              <div className="relative">
                <DrawerTitle>
                  <Text typo="h3">{t('profile.초대할_때마다_별_50개')}</Text>
                </DrawerTitle>
              </div>

              <Text typo="body-1-medium" color="sub" className="text-center">
                {t('profile.친구_가족_지인들에게_픽토스를_공유해주세요')} <br />
                {t('profile.그분이_해당_링크를_통해_픽토스에_가입하실_경우')} <br />
                {t('profile.두_분_모두에게_별_50개를_드려요')}
              </Text>
            </div>
          </DrawerHeader>

          <div className="w-full max-w-[300px] flex-center flex-col gap-[24px]">
            <div className="relative max-w-[260px]">
              <Input
                label={t('profile.내_링크')}
                value={inviteLink}
                right={
                  <SquareButton size={'sm'} variant={'tertiary'} onClick={handleCopy}>
                    {t('profile.복사')}
                  </SquareButton>
                }
                disabled
                className="disabled:text-sub truncate"
              />

              {!inviteLink && (
                <div className="absolute top-[50px] left-1/2 -translate-x-1/2 flex w-fit gap-[8px]">
                  <div className="size-[8px] rounded-full bg-[var(--color-gray-500)] animate-pulse [animation-duration:1s]"></div>
                  <div className="size-[8px] rounded-full bg-[var(--color-gray-500)] animate-pulse [animation-duration:1s] [animation-delay:0.2s] "></div>
                  <div className="size-[8px] rounded-full bg-[var(--color-gray-500)] animate-pulse [animation-duration:1s] [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col gap-[8px]">
              <Button
                onClick={async () => await handleKakaoShare()}
                variant={'secondary1'}
                size={'md'}
                className="w-full bg-[var(--color-yellow)] text-primary hover:bg-[var(--color-yellow)]"
                left={<ImgRoundKakao width={32} height={32} />}
              >
                {t('profile.카카오톡에_공유하기')}
              </Button>

              <Button
                onClick={handleNativeShare}
                size={'md'}
                className="w-full"
                left={<IcUpload className="size-[20px]" />}
              >
                {t('profile.링크_공유하기')}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default InviteDrawer
