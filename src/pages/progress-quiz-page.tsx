import { useQueryParam } from '@/shared/lib/router/query-param'

export const ProgressQuizPage = () => {
  // name 파라미터는 /progress-quiz/:quizId 경로에 정의되어 있으며, 자동으로 타입 검증됨
  // name은 '유민' | '정우' 타입으로 정의되어 있음
  const [name, setName] = useQueryParam('name', '유민', '/progress-quiz/:quizId')

  // emoji와 date 파라미터도 사용 가능
  const [emoji, setEmoji] = useQueryParam('emoji', '', '/progress-quiz/:quizId')
  const [date, setDate] = useQueryParam('date', '', '/progress-quiz/:quizId')

  return (
    <div>
      <h1>Progress Quiz</h1>
      <p>현재 선택된 이름: {name}</p>
      <button onClick={() => setName(name === '유민' ? '정우' : '유민')}>이름 변경</button>

      <p>이모지: {emoji || '없음'}</p>
      <button onClick={() => setEmoji(emoji ? '' : '🎉')}>이모지 토글</button>

      <p>날짜: {date || '없음'}</p>
      <button onClick={() => setDate(date ? '' : new Date().toISOString().split('T')[0])}>오늘 날짜로 설정</button>
    </div>
  )
}
