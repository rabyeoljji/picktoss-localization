import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

interface Props {
  emoji: string
  question: string
  color?: 'light' | 'dark'
  className?: HTMLElement['className']
}

const QuestionBox = ({ emoji, question, color = 'light', className }: Props) => {
  return (
    <div
      className={cn(
        'px-2.5 py-1.5 rounded-lg inline-flex justify-center items-center gap-2.5',
        color === 'dark' ? 'bg-inverse' : 'bg-base-1',
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <Text typo="body-2-medium" color={color === 'light' ? 'secondary' : 'inverse-dim'} className="leading-none">
          {emoji} {question}
        </Text>
      </div>
    </div>
  )
}

export default QuestionBox
