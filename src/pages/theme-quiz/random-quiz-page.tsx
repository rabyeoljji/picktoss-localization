import { useQueryParam } from '@/shared/lib/router/query-param'

export const RandomQuizPage = () => {
  // date 파라미터는 /random-quiz 경로에 정의되어 있으며, 자동으로 타입 검증됨
  const [date, setDate] = useQueryParam('date', '', '/random-quiz')

  return (
    <div>
      <h1>Random Quiz</h1>
      <p>현재 선택된 날짜: {date || '없음'}</p>
      <button onClick={() => setDate(date ? '' : new Date().toISOString().split('T')[0])}>
        {date ? '날짜 초기화' : '오늘 날짜로 설정'}
      </button>
    </div>
  )
}
