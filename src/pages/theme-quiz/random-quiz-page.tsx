import { useQueryParam } from '@/shared/lib/router/query-param'

const RandomQuizPage = () => {
  // 명시적으로 '/random-quiz' 경로 지정
  const [date, setDate] = useQueryParam('date', '이게 무슨..')
  console.log(date)

  return (
    <div>
      <h1>랜덤퀴즈</h1>
      <p>선택된 날짜: {date || '날짜가 선택되지 않았습니다'}</p>
      <button onClick={() => setDate(new Date().toISOString().split('T')[0])}>오늘 날짜로 설정</button>
    </div>
  )
}

export default RandomQuizPage
