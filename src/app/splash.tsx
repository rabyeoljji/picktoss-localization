// import { motion } from 'framer-motion'
import { ImgSymbol } from '@/shared/assets/images'

const Splash = () => {
  return (
    <div className="size-full overflow-hidden bg-surface-1">
      <ImgSymbol className="size-36 center z-50" />

      {/* 추후 애니메이션이 쓰이게 되면 활성화 */}
      {/* <motion.div
        className="center z-50"
        initial={{ x: 120, y: -120, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{
          // delay: 0.1,
          type: 'spring',
          mass: 1,
          stiffness: 100,
          damping: 15,
        }}
      >
        <ImgSymbol className="size-36" />
      </motion.div> */}
    </div>
  )
}
export default Splash
