import { useState } from 'react'

import { PanInfo, motion, useAnimation, useMotionValue } from 'framer-motion'

import { IcFolder } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

import { NoteIcon } from '@/shared/components/bg-icons/note-icon'

interface Props {
  children: React.ReactNode
  selectMode: boolean
  onSelect: () => void
  onClick: () => void
  swipeOptions: React.ReactNode[]
  className?: HTMLElement['className']
}

export const NoteCard = ({ children, className, selectMode, onSelect, onClick, swipeOptions }: Props) => {
  const [isSwiped, setIsSwiped] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const controls = useAnimation()

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -30) {
      setIsSwiped(true) // 30px 이상 드래그하면 스와이프
      await controls.start({ x: -(swipeOptions.length * 65) }) // 요소 왼쪽으로 이동
    } else {
      setIsSwiped(false) // 스와이프 취소
      await controls.start({ x: 0 }) // 원래 위치로 이동
    }
    setIsDragging(false)
  }

  const handleClickCard = () => {
    onSelect()

    if (!selectMode && !isDragging && !isSwiped) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleClickCard}
      className={cn(
        `relative flex h-[104px] max-w-full items-center overflow-hidden rounded-[16px] bg-white px-[16px] pb-[20px] pt-[17px] shrink-0 cursor-pointer`,
        className,
      )}
    >
      {/* Swipe 영역 */}
      <motion.div
        className="flex h-[104px] max-w-full items-center rounded-[16px] px-[16px] py-[17px]"
        drag={selectMode ? false : 'x'}
        dragConstraints={{ left: -(swipeOptions.length * 65), right: 0 }}
        onDrag={() => !selectMode && setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}

        {/* Swipe로 보여지는 버튼 영역 */}
        <motion.div
          initial={false}
          animate={{ x: isSwiped ? swipeOptions.length * 72 : swipeOptions.length * 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-y-0 right-0 flex h-[calc(100%+2px)] flex-row overflow-hidden rounded-r-[16px]"
        >
          {swipeOptions.map((option) => option)}
        </motion.div>
      </motion.div>
    </div>
  )
}

const NoteCardLeft = ({
  type,
  checkBox,
  selectMode,
}: {
  // type: 'FILE' | 'TEXT' | 'NOTION'
  type: 'FILE' | 'TEXT'
  checkBox: React.ReactNode
  selectMode: boolean
}) => {
  return (
    <>
      {selectMode ? (
        <>{checkBox}</>
      ) : (
        <NoteIcon type={type} containerClassName="size-[36px]" iconClassName="size-[16px]" />
      )}
    </>
  )
}

const NoteCardContents = ({ children }: { children: React.ReactNode }) => {
  return <div className="ml-[16px] flex w-full flex-col">{children}</div>
}

const NoteCardHeader = ({ title, tag }: { title: string; tag?: React.ReactNode }) => {
  return (
    <div className="mb-[2px] flex items-center gap-[8px]">
      <Text as="h4" typo="subtitle-2-bold" className="w-fit max-w-[calc(100%-100px)] overflow-x-hidden truncate">
        {title}
      </Text>

      {tag}
    </div>
  )
}

const NoteCardPreview = ({ content }: { content: string }) => {
  return (
    <Text typo="body-1-regular" color="sub" className="w-[calc(100%-55px)] truncate text-nowrap break-all">
      {content}
    </Text>
  )
}

const NoteCardDetail = ({
  quizCount,
  charCount,
  directory,
}: {
  quizCount: number
  charCount: number
  directory: string
}) => {
  return (
    <Text typo="body-2-medium" color="sub" className="flex w-fit items-center">
      <span>{quizCount}문제</span>
      <div className="inline-block size-fit mx-[8px] text-icon-sub">•</div>
      <span>{charCount}자</span>
      <div className="inline-block size-fit mx-[8px] text-icon-sub">•</div>
      <span className="flex items-center">
        <IcFolder className="size-[12px] mr-[2px] text-icon-tertiary" />
        {directory}
      </span>
    </Text>
  )
}

NoteCard.Left = NoteCardLeft
NoteCard.Contents = NoteCardContents
NoteCard.Header = NoteCardHeader
NoteCard.Preview = NoteCardPreview
NoteCard.Detail = NoteCardDetail
