import { IcFolder } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { Link } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

interface Props {
  documentId: number | null
  documentTitle: React.ReactNode
  matchingSentence: React.ReactNode
  resultType: 'document' | 'quiz'
  quizCount: number
  charCount: number
  relativeDirectory: string
  directoryEmoji: string
  lastItem?: boolean
}

const SearchQuizNoteItem = ({
  documentId,
  documentTitle,
  matchingSentence,
  resultType,
  quizCount,
  charCount,
  relativeDirectory,
  directoryEmoji,
  lastItem,
}: Props) => {
  return (
    <Link
      to="/library/:noteId"
      params={[String(documentId)]}
      search={resultType === 'quiz' ? { tab: ['QUIZ'] } : {}}
      className={cn('border-b border-divider py-[24px] flex flex-col', lastItem && 'border-none')}
    >
      <div className="mb-[8px] flex items-center">
        <Text typo="subtitle-2-bold">
          {directoryEmoji} {documentTitle}
        </Text>
      </div>

      <Text typo="body-1-regular" className="text-sub">
        {matchingSentence}
      </Text>

      <div className="mt-[8px] flex items-center">
        <Text typo="body-2-medium" color="sub" className="flex w-fit items-center">
          <span>{quizCount}문제</span>
          <div className="inline-block size-fit mx-[8px] text-icon-sub">•</div>
          <span>{charCount}자</span>
          <div className="inline-block size-fit mx-[8px] text-icon-sub">•</div>
          <span className="flex items-center">
            <IcFolder className="size-[12px] mr-[2px] text-icon-tertiary" />
            {relativeDirectory}
          </span>
        </Text>
      </div>
    </Link>
  )
}

export default SearchQuizNoteItem
