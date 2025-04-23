import { NotificationType } from '@/entities/notification/api'

import { ImgRoundMegaphone, ImgRoundPicktoss, ImgRoundStar } from '@/shared/assets/images'
import { Text } from '@/shared/components/ui/text'
import { getRelativeTime } from '@/shared/lib/date'
import { cn } from '@/shared/lib/utils'

const notificationTypeIcon = {
  GENERAL: { label: '일반', icon: <ImgRoundPicktoss width={32} height={32} /> },
  STAR_REWARD: { label: '별 지급', icon: <ImgRoundStar width={32} height={32} /> },
  UPDATE_NEWS: { label: '업데이트·소식', icon: <ImgRoundMegaphone width={32} height={32} /> },
  TODAY_QUIZ: { label: '업데이트·소식', icon: <ImgRoundPicktoss width={32} height={32} /> }, // 레거시, 백엔드에 삭제 요청
}

interface Props {
  type: NotificationType
  title: string
  receivedTime: string
  lastItem?: boolean
}

const NotificationItem = ({ type, title, receivedTime, lastItem }: Props) => {
  return (
    <div
      className={cn('w-full border-b border-divider py-[20px] flex items-center gap-[16px]', lastItem && 'border-none')}
    >
      {notificationTypeIcon[type].icon}

      <div className="flex flex-1 flex-col gap-[2px] justify-center">
        <div className="w-full flex items-center justify-between">
          <Text typo="body-1-medium" color="sub">
            {notificationTypeIcon[type].label}
          </Text>

          <Text typo="body-2-medium" color="caption">
            {getRelativeTime(receivedTime)}
          </Text>
        </div>

        <Text typo="subtitle-2-bold">{title}</Text>
      </div>
    </div>
  )
}

export default NotificationItem
