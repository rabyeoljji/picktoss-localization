import { useParams } from 'react-router'

import { useGetDocumentQuizzes } from '@/entities/document/api/hooks'

import { useQueryParam } from '@/shared/lib/router'

export const ProgressQuizPage = () => {
  const { quizId } = useParams()

  const [name, setName, resetName] = useQueryParam('/progress-quiz/:quizId', 'name')
  const [params, setParams, resetParams] = useQueryParam('/progress-quiz/:quizId')
  const { data: quizzes } = useGetDocumentQuizzes({
    documentId: Number(quizId),
  })

  console.log(quizzes)

  return (
    <div className="grid gap-2">
      <div>{name}</div>
      <button onClick={() => setName('정우')}>이름 변경</button>
      <button onClick={() => resetName()}>이름 초기화</button>

      <div>{JSON.stringify(params)}</div>
      <button onClick={() => setParams((prev) => ({ ...prev, emoji: '이모지', name: '정우', date: '오늘' }))}>
        파람 변경
      </button>
      <button onClick={() => resetParams()}>파람 초기화</button>
    </div>
  )
}
