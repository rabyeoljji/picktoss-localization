import { useQueryParam } from '@/shared/lib/router/query-param'

export const ProgressQuizPage = () => {
  // name 파라미터는 /progress-quiz/:quizId 경로에 정의되어 있으며
  // SearchConfig에는 '유민' | '정우' 리터럴 유니온 타입으로 정의됨
  const [name, setName] = useQueryParam('/progress-quiz/:quizId', 'name', '유민')

  // emoji와 date 파라미터도 사용 가능
  const [emoji, setEmoji] = useQueryParam('/progress-quiz/:quizId', 'emoji', '')
  const [date, setDate] = useQueryParam('/progress-quiz/:quizId', 'date', '')

  return (
    <div>
      <h1>Progress Quiz</h1>
      <p>현재 선택된 이름: {name}</p>
      {/* 이제 '유민' | '정우' 유니온 타입으로 올바르게 인식됨 */}
      <button onClick={() => setName(name === '유민' ? '정우' : '유민')}>이름 변경</button>

      <p>이모지: {emoji || '없음'}</p>
      <button onClick={() => setEmoji(emoji ? '' : '🎉')}>이모지 토글</button>

      <p>날짜: {date || '없음'}</p>
      <button onClick={() => setDate(date ? '' : new Date().toISOString().split('T')[0])}>오늘 날짜로 설정</button>
    </div>
  )
}
