import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useAuthStore } from '@/features/auth'
import InterestedCategoryDrawer from '@/features/user/ui/interested-category-drawer'

import { useUpdateMemberImage, useUpdateMemberName, useUser } from '@/entities/member/api/hooks'

import { IcCamera, IcChevronRight, IcMy } from '@/shared/assets/icon'
import { ImgRoundGoogle, ImgRoundKakao } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Input } from '@/shared/components/ui/input'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { RoutePath, useRouter } from '@/shared/lib/router'

const AccountInfoPage = () => {
  const router = useRouter()

  const { clearToken } = useAuthStore()
  const { data: user } = useUser()

  const [nameDialogOpen, setNameDialogOpen] = useState<boolean>(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  const { mutate: updateMemberName, isPending } = useUpdateMemberName()
  const { mutate: updateMemberImage } = useUpdateMemberImage()

  // 초기 설정
  useEffect(() => {
    if (user) {
      setNewName(user.name)
      setImageUrl(user.image)
    }
  }, [user])

  // 로그아웃
  const handleLogout = () => {
    clearToken()
  }

  // 이름 변경 dialog open 핸들러
  const handleSetNameDialogOpen = (open: boolean) => {
    if (!open) {
      setNewName(user?.name ?? '')
    }

    setNameDialogOpen(open)
  }

  // 이름 변경 핸들러
  const handleChangeName = () => {
    updateMemberName(
      { name: newName },
      {
        onSuccess: () => {
          toast('닉네임이 변경되었어요')
          setNameDialogOpen(false)
          setNewName(user?.name ?? '')
        },
      },
    )
  }

  // File을 string으로 변환하는 함수
  const convertFileToString = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // 파일 선택 핸들러
  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevState = user?.image

    const file = e.target.files?.[0]
    if (file) {
      const imageString = await convertFileToString(file)
      setImageUrl(imageString)

      updateMemberImage(
        { image: file },
        {
          onSuccess: () => {
            if (!prevState) {
              toast('프로필 사진이 등록되었어요')
            } else {
              toast('프로필 사진이 변경되었어요')
            }
          },
          onError: (error) => {
            console.error('이미지 변환 실패:', error)
            setImageUrl(user?.image) // 기존 이미지로 되돌림
          },
        },
      )
    }
  }

  return (
    <>
      <Header left={<BackButton />} title="계정 정보" />

      <HeaderOffsetLayout className="h-full flex flex-col overflow-x-hidden px-[16px] justify-between">
        <div className="w-full flex flex-col">
          <div className="flex-center w-full pb-[44px] pt-[24px]">
            <div className="relative">
              <div className="flex-center relative size-[96px] overflow-hidden rounded-full bg-base-3">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="object-cover" />
                ) : (
                  <IcMy className="size-[56px] text-icon-sub" />
                )}
              </div>
              {/* 이미지 등록 버튼 */}
              <input
                type="file"
                name="file"
                id="userImage"
                className="hidden"
                accept="image/*"
                onChange={handleChangeImage}
              />
              <label
                htmlFor="userImage"
                className="flex-center absolute z-10 bottom-0 right-0 size-[32px] cursor-pointer rounded-full border border-outline bg-base-1"
              >
                <IcCamera className="size-[16px]" />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-[32px]">
            <button
              type="button"
              onClick={() => setNameDialogOpen(true)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex flex-col items-start gap-[4px]">
                <Text typo="body-1-medium" color="sub">
                  닉네임
                </Text>

                <Text typo="subtitle-2-medium">{user?.name}</Text>
              </div>
              <IcChevronRight className="size-[16px] text-icon-sub" />
            </button>
            <SystemDialog
              open={nameDialogOpen}
              onOpenChange={handleSetNameDialogOpen}
              title="닉네임 변경"
              description="새로 사용할 이름을 입력해주세요"
              preventClose={isPending}
              content={
                <>
                  {isPending ? (
                    <div className="animate-pulse text-center">Loading...</div>
                  ) : (
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={user?.name}
                      max={10}
                      hasClear
                      onClearClick={() => setNewName('')}
                      helperText={`10자 이내로 입력해주세요 (${newName.length}/10)`}
                    />
                  )}
                </>
              }
              onConfirm={handleChangeName}
              disabledConfirm={newName.length === 0}
            />

            <InterestedCategoryDrawer interestedCategory={user?.category} />

            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col items-start gap-[4px]">
                <Text typo="body-1-medium" color="sub">
                  이메일
                </Text>

                <Text typo="subtitle-2-medium" color="primary">
                  {user?.email ? user.email : '이메일 주소를 등록해주세요'}
                </Text>
              </div>
            </div>

            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col items-start gap-[4px]">
                <Text typo="body-1-medium" color="sub">
                  로그인 정보
                </Text>
                <div className="flex items-center gap-[8px]">
                  {user?.socialPlatform === 'KAKAO' ? (
                    <>
                      <ImgRoundKakao className="size-[20px]" />
                      <Text typo="subtitle-2-medium">카카오 로그인</Text>
                    </>
                  ) : (
                    <>
                      <ImgRoundGoogle className="size-[20px]" />
                      <Text typo="subtitle-2-medium">구글 로그인</Text>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-center pb-[56px]">
          <TextButton
            onClick={() => setLogoutDialogOpen(true)}
            variant={'sub'}
            size={'sm'}
            className="pr-[16px] border-r border-divider"
          >
            로그아웃
          </TextButton>
          <SystemDialog
            open={logoutDialogOpen}
            onOpenChange={setLogoutDialogOpen}
            title="로그아웃 하시겠어요?"
            cancelLabel="취소"
            confirmLabel="로그아웃"
            variant="critical"
            onConfirm={handleLogout}
          />
          <TextButton
            onClick={() => router.push(RoutePath.accountWithdraw)}
            variant={'sub'}
            size={'sm'}
            className="pl-[16px]"
          >
            탈퇴하기
          </TextButton>
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(AccountInfoPage, {})
