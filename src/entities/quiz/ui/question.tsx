import { Text } from '@/shared/components/ui/text'

interface QuestionProps {
  order: number
  question: string
}

export const Question = ({ order, question }: QuestionProps) => {
  return (
    <div className="grid gap-2">
      <Text typo="h4" color="accent">
        Q{order}.
      </Text>
      <Text typo="question" color="primary">
        {question}
      </Text>
    </div>
  )
}
