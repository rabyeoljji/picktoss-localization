import { cn } from '@/shared/lib/utils'

const FixedBottom = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 right-1/2 translate-x-1/2 mx-auto z-50 h-fit w-full max-w-xl px-[16px] pt-[14px] pb-[calc(env(safe-area-inset-bottom)+24px)] items-start',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default FixedBottom
