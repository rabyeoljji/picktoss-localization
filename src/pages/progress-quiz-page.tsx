import { useQueryParam } from '@/shared/lib/router/query-param'

export const ProgressQuizPage = () => {
  // 방법 1: 개별 파라미터 접근 방식
  // name 파라미터는 /progress-quiz/:quizId 경로에 정의되어 있으며
  // SearchConfig에는 '유민' | '정우' 리터럴 유니온 타입으로 정의됨
  const [name, setName] = useQueryParam('/progress-quiz/:quizId', 'name')
  const [emoji, setEmoji] = useQueryParam('/progress-quiz/:quizId', 'emoji')
  const [date, setDate] = useQueryParam('/progress-quiz/:quizId', 'date')
  console.log(name)

  // 방법 2: 객체 형태로 모든 파라미터 관리
  // 모든 쿼리 파라미터를 하나의 객체로 관리
  const [params, setParams] = useQueryParam('/progress-quiz/:quizId')

  return (
    <div>
      <h1 onClick={() => setParams((prev) => ({ ...prev, name: '정우' }))}>Progress Quiz</h1>

      <h2>방법 1: 개별 파라미터 접근</h2>
      <p>현재 선택된 이름: {name}</p>
      <button onClick={() => setName(name === '유민' ? '정우' : '유민')}>이름 변경</button>

      <p>이모지: {emoji || '없음'}</p>
      <button onClick={() => setEmoji(emoji ? '' : '🎉')}>이모지 토글</button>

      <p>날짜: {date || '없음'}</p>
      <button onClick={() => setDate(date ? '' : new Date().toISOString().split('T')[0])}>오늘 날짜로 설정</button>

      <h2>방법 2: 객체 형태로 모든 파라미터 관리</h2>
      <pre>{JSON.stringify(params, null, 2)}</pre>

      {/* 방법 1: 객체 직접 업데이트 */}
      <button onClick={() => setParams({ ...params, name: params.name === '유민' ? '정우' : '유민' })}>
        이름 변경 (객체 직접 업데이트)
      </button>

      {/* 방법 2: 함수형 업데이트 (prev 상태 사용) */}
      <button onClick={() => setParams((prev) => ({ ...prev, emoji: prev.emoji ? '' : '🎉' }))}>
        이모지 토글 (함수형 업데이트)
      </button>

      {/* 방법 3: 여러 값 동시에 업데이트 */}
      <button
        onClick={() =>
          setParams((prev) => ({
            ...prev,
            name: prev.name === '유민' ? '정우' : '유민',
            date: new Date().toISOString().split('T')[0],
          }))
        }
      >
        이름 변경 및 오늘 날짜 설정 (함수형 업데이트)
      </button>
    </div>
  )
}
