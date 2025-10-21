import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: HTMLElement['className']
  isSelected?: boolean
}

export const SelectableNoteCard = ({ children, className, isSelected, ...props }: Props) => {
  return (
    <div
      className={cn(
        `relative flex h-[104px] max-w-full items-center overflow-hidden rounded-[16px] bg-white pl-[12px] pr-[16px] py-[19px] shrink-0 cursor-pointer border border-outline`,
        className,
        isSelected && 'bg-accent border-accent',
      )}
      {...props}
    >
      <div className="relative flex h-full w-full items-center rounded-[16px]">{children}</div>
    </div>
  )
}

const SelectableNoteCardLeft = ({ content }: { content: string }) => {
  return (
    <div className={cn('flex-center size-10 shrink-0 text-inverse')}>
      <Text typo="h3">{content}</Text>
    </div>
  )
}

const SelectableNoteCardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="ml-[12px] flex w-[calc(100%-55px-20px)] flex-col">{children}</div>
}

const SelectableNoteCardHeader = ({ title, tag }: { title: string; tag?: React.ReactNode }) => {
  return (
    <div className="relative mb-[2px] flex items-center gap-[8px]">
      <Text as="h4" typo="subtitle-2-bold" className="w-fit max-w-[calc(100%-100px)] overflow-x-hidden truncate">
        {title}
      </Text>

      {tag}
    </div>
  )
}

const SelectableNoteCardPreview = ({ content }: { content: string }) => {
  return (
    <Text typo="body-1-regular" color="sub" className="w-[calc(100%-40px)] truncate text-nowrap break-all">
      {content}
    </Text>
  )
}

const SelectableNoteCardDetail = ({ quizCount }: { quizCount: number }) => {
  const { t } = useTranslation()

  return (
    <Text typo="body-2-medium" color="sub" className="flex w-fit items-center mt-[4px]">
      <div className="inline-flex justify-start items-center gap-[2px]">
        <span>{t('common.quiz_card.question_count', { count: quizCount })}</span>
      </div>

      <div className="inline-block size-[3px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />
      <span>{t('common.quiz_card.private')}</span>
    </Text>
  )
}

SelectableNoteCard.Left = SelectableNoteCardLeft
SelectableNoteCard.Content = SelectableNoteCardContent
SelectableNoteCard.Header = SelectableNoteCardHeader
SelectableNoteCard.Preview = SelectableNoteCardPreview
SelectableNoteCard.Detail = SelectableNoteCardDetail
