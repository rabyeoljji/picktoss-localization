import { useQueryParam } from '@/shared/lib/router'

export const ProgressQuizPage = () => {
  // 방법 1: 개별 파라미터 접근 방식
  // name 파라미터는 /progress-quiz/:quizId 경로에 정의되어 있으며
  // SearchConfig에는 '유민' | '정우' 리터럴 유니온 타입으로 정의됨
  const [name, setName, removeName] = useQueryParam('/progress-quiz/:quizId', 'name')
  const [emoji, setEmoji, removeEmoji] = useQueryParam('/progress-quiz/:quizId', 'emoji')
  const [date, setDate, removeDate] = useQueryParam('/progress-quiz/:quizId', 'date')

  // 방법 2: 객체 형태로 모든 파라미터 관리
  // 모든 쿼리 파라미터를 하나의 객체로 관리
  const [params, setParams, removeAllParams] = useQueryParam('/progress-quiz/:quizId')

  return (
    <div>
      <h1 onClick={() => setParams({ ...params, name: '정우' })}>Progress Quiz</h1>

      <h2>방법 1: 개별 파라미터 접근</h2>
      <p>현재 선택된 이름: {name}</p>
      <button onClick={() => setName(name === '유민' ? '정우' : '유민')}>이름 변경</button>
      <button onClick={() => removeName()}>이름 삭제</button>
      <button onClick={() => setName(name === '유민' ? '정우' : '유민', { push: false })}>
        이름 변경 (히스토리 대체)
      </button>

      <p>이모지: {emoji || '없음'}</p>
      <button onClick={() => setEmoji(emoji ? '' : '🎉')}>이모지 토글</button>
      <button onClick={() => removeEmoji()}>이모지 삭제</button>
      <button onClick={() => removeEmoji({ push: true })}>이모지 삭제 (히스토리 추가)</button>

      <p>날짜: {date || '없음'}</p>
      <button onClick={() => setDate(date ? '' : new Date().toISOString().split('T')[0])}>오늘 날짜로 설정</button>
      <button onClick={() => removeDate()}>날짜 삭제</button>
      <button onClick={() => setDate('', { emptyHandling: 'preserve' })}>날짜 빈 값으로 설정</button>

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
        이름 & 날짜 변경 (복합 업데이트)
      </button>

      {/* 모든 쿼리 파라미터 삭제 */}
      <button onClick={() => removeAllParams()}>모든 쿼리 파라미터 삭제</button>

      {/* 옵션 오버라이드 예시 */}
      <button onClick={() => setParams({ ...params, name: '유민', emoji: '🚀' }, { push: false })}>
        모든 값 설정 (히스토리 대체)
      </button>
    </div>
  )
}
