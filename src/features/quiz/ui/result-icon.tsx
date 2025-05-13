import { AnimatePresence, motion } from 'framer-motion'

import { ImgRoundCorrect, ImgRoundIncorrect } from '@/shared/assets/images'

export const ResultIcon = ({ correct }: { correct: boolean }) => {
  const iconVariants = {
    initial: {
      scale: 0,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        scale: {
          type: 'spring',
          damping: 10,
          stiffness: 100,
          duration: 0.4,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      {correct && (
        <motion.div
          key="CORRECT"
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="z-[9999] absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2"
        >
          <ImgRoundCorrect className="size-[78px]" />
        </motion.div>
      )}
      {!correct && (
        <motion.div
          key="INCORRECT"
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="z-[9999] absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2"
        >
          <ImgRoundIncorrect className="size-[78px]" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
