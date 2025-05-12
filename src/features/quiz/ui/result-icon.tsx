import { motion } from 'framer-motion'

import { ImgRoundCorrect, ImgRoundIncorrect } from '@/shared/assets/images'

export const ResultIcon = ({ correct }: { correct: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: 'spring',
        mass: 1,
        velocity: 3,
        duration: 0.3,
      }}
      exit={{ opacity: 0, scale: 0.7 }}
    >
      {correct && <ImgRoundCorrect className="size-[78px] absolute right-1/2 translate-x-1/2 bottom-[100px]" />}
      {!correct && <ImgRoundIncorrect className="size-[78px] absolute right-1/2 translate-x-1/2 bottom-[100px]" />}
    </motion.div>
  )
}
