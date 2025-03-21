import { IcFolder } from '@/shared/assets/icon'
import { NoteIcon, NoteType } from '@/shared/components/bg-icons/note-icon'
import { Text } from '@/shared/components/ui/text'
import { Link, RoutePath } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

interface Props {
  documentId: number | null
  createType: NoteType
  documentTitle: React.ReactNode
  matchingSentence: React.ReactNode
  resultType: 'document' | 'quiz'
  relativeDirectory: string
  lastItem?: boolean
}

const SearchItem = ({
  documentId,
  createType,
  documentTitle,
  matchingSentence,
  resultType,
  relativeDirectory,
  lastItem,
}: Props) => {
  return (
    <Link
      to={RoutePath.noteDetail}
      params={[String(documentId)]}
      search={resultType === 'quiz' ? { tab: ['QUIZ'] } : {}}
      className={cn('border-b border-divider py-[24px] flex flex-col', lastItem && 'border-none')}
    >
      <div className="mb-[8px] flex items-center">
        <NoteIcon type={createType} containerClassName="size-[20px] mr-[8px]" iconClassName="size-[11px]" />
        <Text typo="subtitle-2-bold">{documentTitle}</Text>
      </div>

      <Text typo="body-1-regular">{matchingSentence}</Text>

      <div className="mt-[8px] flex items-center">
        {/* <Tag colors={'tertiary'} className="mr-[8px]">
          {resultType === 'document' && '노트 결과'}
          {resultType === 'quiz' && '퀴즈 결과'}
        </Tag> */}
        <div className="flex items-center">
          <IcFolder className="size-[12px] mr-[4px] text-icon-tertiary" />
          <Text typo="body-2-medium">{relativeDirectory}</Text>
        </div>
      </div>
    </Link>
  )
}

export default SearchItem
