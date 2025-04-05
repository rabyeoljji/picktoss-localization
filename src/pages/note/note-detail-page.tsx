import { useParams } from 'react-router'

import { useGetSingleDocument } from '@/entities/document/api/hooks'

import { IcUpload } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { QuestionCard } from '@/shared/components/cards/question-card'
import { Header } from '@/shared/components/header/header'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const NoteDetailPage = () => {
  const { noteId } = useParams()
  const [quizType, setQuizType] = useQueryParam('/note/:noteId', 'quizType')

  const { data } = useGetSingleDocument(noteId ? Number(noteId) : -1)
  console.log(data)
  return (
    <div>
      <Header
        left={<BackButton />}
        content={
          <div className="flex justify-end">
            <Button size="sm" left={<IcUpload />}>
              공유하기
            </Button>
          </div>
        }
      />
      <main className="pt-[var(--header-height)]">
        <div className="px-4 pb-6">
          <div className="size-[48px] bg-blue-300" />
          <Text typo="h3" className="mt-3">
            {data?.documentName}
          </Text>
          <div className="mt-2">
            <Text typo="body-1-medium" color="sub">
              2025.05.28
            </Text>
          </div>
        </div>

        <div className="flex">
          <button
            onClick={() => setQuizType('MIX_UP')}
            className={cn(
              'flex-1 typo-subtitle-2-bold pt-[14px] pb-[10px]',
              quizType === 'MIX_UP' ? 'text-primary border-b-2 border-[#393B3D]' : 'border-b-1 border-divider text-sub',
            )}
          >
            객관식
          </button>
          <button
            onClick={() => setQuizType('MULTIPLE_CHOICE')}
            className={cn(
              'flex-1 typo-subtitle-2-bold pt-[14px] pb-[10px]',
              quizType === 'MULTIPLE_CHOICE'
                ? 'text-primary border-b-2 border-[#393B3D]'
                : 'border-b-1 border-divider text-sub',
            )}
          >
            O/X
          </button>
        </div>

        <div className="px-4 py-4">
          {quizType === 'MIX_UP' ? (
            <div className="grid gap-2">
              {data?.quizzes
                .filter((quiz) => quiz.quizType === 'MIX_UP')
                .map((quiz, index) => (
                  <QuestionCard key={quiz.id}>
                    <QuestionCard.Header order={index + 1} right={<div>...</div>} />
                    <QuestionCard.Question>{quiz.question}</QuestionCard.Question>
                    <QuestionCard.OX />
                    <QuestionCard.Explanation>{quiz.explanation}</QuestionCard.Explanation>
                  </QuestionCard>
                ))}
            </div>
          ) : (
            <div className="grid gap-2">
              {data?.quizzes
                .filter((quiz) => quiz.quizType === 'MULTIPLE_CHOICE')
                .map((quiz, index) => (
                  <QuestionCard key={quiz.id}>
                    <QuestionCard.Header order={index + 1} right={<div>...</div>} />
                    <QuestionCard.Question>{quiz.question}</QuestionCard.Question>
                    <QuestionCard.Multiple options={quiz.options} />
                    <QuestionCard.Explanation>{quiz.explanation}</QuestionCard.Explanation>
                  </QuestionCard>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default NoteDetailPage
