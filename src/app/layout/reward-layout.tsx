import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'

import { useStore } from 'zustand'

import { useAuthStore } from '@/features/auth'
import RewardDialogForInvitee from '@/features/invite/ui/reward-dialog-for-invitee'
import RewardDialogForInviter from '@/features/invite/ui/reward-dialog-for-inviter'

import { useCheckInviteCodeBySignUp } from '@/entities/auth/api/hooks'

import { getLocalStorageItem } from '@/shared/lib/storage/lib'

export const RewardLayout = () => {
  const token = useStore(useAuthStore, (state) => state.token)

  // 초대 코드 보상 관련
  const storageInviteCode = getLocalStorageItem('inviteCode')
  const [inviteCode, setInviteCode] = useState(storageInviteCode)
  const [openRewardForInvitee, setOpenRewardForInvitee] = useState(false)
  const [openRewardForInviter, setOpenRewardForInviter] = useState(false)
  const { data: hasInviteeData } = useCheckInviteCodeBySignUp({ enabled: !!token })

  useEffect(() => {
    if (token) {
      const storageInviteCode = getLocalStorageItem('inviteCode')
      setInviteCode(storageInviteCode)
    }
  }, [token])

  useEffect(() => {
    if (inviteCode) {
      console.log(inviteCode)

      setOpenRewardForInvitee(true)
    }
  }, [inviteCode])

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
      />
      <RewardDialogForInviter open={openRewardForInviter} onOpenChange={setOpenRewardForInviter} />

      <Outlet />
    </>
  )
}
