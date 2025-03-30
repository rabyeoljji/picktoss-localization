import { useState } from 'react'
import { useParams } from 'react-router'

import { ProgressBar } from '@/features/quiz/progress-bar'
import { StopWatch } from '@/features/quiz/stop-watch'

import { useGetDocumentQuizzes } from '@/entities/document/api/hooks'

import { IcControl } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'

export const ProgressQuizPage = () => {
  const { quizId } = useParams()
  const [currentQuestion, _setCurrentQuestion] = useState(2)

  const { data: quizzes } = useGetDocumentQuizzes({
    documentId: Number(quizId),
  })

  if (!quizzes) {
    return <div className="center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <Header
        left={<BackButton type="close" />}
        content={
          <div>
            <div className="center">
              <StopWatch isRunning={true} />
            </div>
            <IcControl className="size-6 ml-auto" />
          </div>
        }
      />

      <div className="p-4">
        <ProgressBar current={4} totalQuizCount={quizzes.length} />
      </div>

      {/* 퀴즈 콘텐츠 영역 */}
      <div className="p-4">{/* 퀴즈 관련 UI 컴포넌트들이 들어갈 자리 */}</div>
    </div>
  )
}
