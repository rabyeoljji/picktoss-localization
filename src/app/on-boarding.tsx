import { motion } from 'framer-motion'

import { withHOC } from '@/app/hoc/with-page-config'

import { SelectCard } from '@/shared/components/cards/select-card'
import FixedBottom from '@/shared/components/fixed-bottom'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { CATEGORIES } from '@/shared/config'

const OnBoarding = () => {
  return (
    <div className="size-full overflow-hidden bg-surface-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.8,
          type: 'spring',
          mass: 1,
          stiffness: 80,
          damping: 20,
        }}
        className="flex items-center flex-col gap-[48px] pt-[66px] px-[16px]"
      >
        <div className="w-full max-w-[324px] inline-flex flex-col justify-start items-start gap-3">
          <div className="flex flex-col justify-start items-start gap-1">
            <Text typo="h2" color="sub" className="flex-center text-center justify-start leading-9">
              <div className="inline-block w-[160px] truncate">{'메리크리스마스'}</div>
              님,
            </Text>
            <Text typo="h2" className="text-center justify-start leading-9">
              현재 어떤 분야를
            </Text>
            <Text typo="h2" className="text-center justify-start leading-9">
              공부 중이세요?
            </Text>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <Text typo="subtitle-2-medium" color="sub" className="self-stretch justify-start leading-normal">
              선택하신 분야들의 퀴즈를 모아 볼 수 있어요
            </Text>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8,
            type: 'spring',
            mass: 1,
            stiffness: 80,
            damping: 20,
          }}
          className="w-fit grid grid-cols-3 grid-rows-3 gap-[12px]"
        >
          {CATEGORIES.map((category) => (
            <SelectCard className="size-[100px] flex-col gap-[4px]">
              <Text typo="h2">{category.emoji}</Text>
              <Text typo="body-1-bold">{category.name}</Text>
            </SelectCard>
          ))}
        </motion.div>

        <FixedBottom className="bg-surface-2">
          <div className="pb-[24px]">
            <Button>선택 완료</Button>
          </div>
        </FixedBottom>
      </motion.div>
    </div>
  )
}

export default withHOC(OnBoarding, {
  backgroundColor: 'bg-surface-2',
})
