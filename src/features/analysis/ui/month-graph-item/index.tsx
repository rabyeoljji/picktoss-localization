import { motion } from 'framer-motion'

import { Text } from '@/shared/components/ui/text'

interface Props {
  date: string
  barHeight: number
  rightHeight: number
}

const MonthGraphItem = ({ date, barHeight, rightHeight }: Props) => {
  const pointDate = [1, 8, 15, 22, 29]
  const isPointDate = pointDate.find((value) => value === Number(date.split('.')[1]))

  const today = date === '오늘'

  return (
    <div className="relative flex h-full w-[4px] flex-col justify-end">
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative mb-[23px] flex w-full flex-col justify-end overflow-hidden rounded-t-[8px] bg-base-3"
        style={{
          height: `${barHeight}%`,
          transformOrigin: 'bottom',
        }}
      >
        <div
          className="w-full rounded-t-[8px] bg-orange"
          style={{
            height: `${rightHeight}%`,
          }}
        />
      </motion.div>

      <Text
        typo={today ? 'caption-bold' : 'caption-medium'}
        color={today ? 'primary' : 'sub'}
        className="absolute right-1/2 min-w-[25px] translate-x-1/2 text-center"
      >
        {(isPointDate || today) && date}
      </Text>
    </div>
  )
}

export default MonthGraphItem
