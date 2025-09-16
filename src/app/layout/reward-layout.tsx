import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'

import { useStore } from 'zustand'

import { useAuthStore } from '@/features/auth'
import RewardDialogForInvitee from '@/features/invite/ui/reward-dialog-for-invitee'
import RewardDialogForInviter from '@/features/invite/ui/reward-dialog-for-inviter'

import { useCheckInviteCodeBySignUp } from '@/entities/auth/api/hooks'
import { useUser } from '@/entities/member/api/hooks'

import { getLocalStorageItem, removeLocalStorageItem } from '@/shared/lib/storage/lib'

export const RewardLayout = () => {
  const token = useStore(useAuthStore, (state) => state.token)
  const isSignUp = useStore(useAuthStore, (state) => state.isSignUp)
  const { data: user } = useUser()

  // 초대 코드 보상 관련
  const storageInviteCode = getLocalStorageItem('inviteCode')
  const storageCheckReward = getLocalStorageItem('checkRewardDialog')

  const [inviteCode, setInviteCode] = useState(storageInviteCode)
  const [checkRewardDialog, setCheckRewardDialog] = useState(storageCheckReward)
  const [openRewardForInvitee, setOpenRewardForInvitee] = useState(false)
  const [openRewardForInviter, setOpenRewardForInviter] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false) // 초기화 상태 추가
  const { data: hasInviteeData } = useCheckInviteCodeBySignUp({ enabled: !!token })

  useEffect(() => {
    if (token) {
      const storageInviteCode = getLocalStorageItem('inviteCode')
      const storageCheckReward = getLocalStorageItem('checkRewardDialog')
      setInviteCode(storageInviteCode)
      setCheckRewardDialog(storageCheckReward)
      setIsInitialized(true) // 초기화 완료 표시
    }
  }, [token])

  useEffect(() => {
    // 초기화가 완료되지 않았다면 실행하지 않음
    if (!isInitialized) {
      return
    }

    if (inviteCode && (isSignUp || checkRewardDialog)) {
      console.log('isSignUp: ', isSignUp, ' / checkRewardDialog: ', checkRewardDialog, ' / inviteCode: ', inviteCode)

      setOpenRewardForInvitee(true)
    } else {
      removeLocalStorageItem('inviteCode')
      removeLocalStorageItem('checkRewardDialog')
    }
  }, [inviteCode, isSignUp, checkRewardDialog, isInitialized])

  useEffect(() => {
    if (hasInviteeData?.type === 'READY') {
      setOpenRewardForInviter(true)
    }
  }, [hasInviteeData])

  return (
    <>
      {/* 초대 보상 dialog */}
      <RewardDialogForInvitee
        open={openRewardForInvitee}
        onOpenChange={setOpenRewardForInvitee}
        inviteCode={inviteCode ?? ''}
        userName={user?.name ?? ''}
      />
      <RewardDialogForInviter
        open={openRewardForInviter}
        onOpenChange={setOpenRewardForInviter}
        userName={user?.name ?? ''}
      />

      <Outlet />
    </>
  )
}
