import { useQueryParam } from '@/shared/lib/router'

export const ProgressQuizPage = () => {
  // 방법 1: 개별 파라미터 접근 방식
  // name 파라미터는 /progress-quiz/:quizId 경로에 정의되어 있으며
  // SearchConfig에는 '유민' | '정우' 리터럴 유니온 타입으로 정의됨
  const [name, setName, resetName] = useQueryParam('/progress-quiz/:quizId', 'name')

  // 방법 2: 객체 형태로 모든 파라미터 관리
  // 모든 쿼리 파라미터를 하나의 객체로 관리
  const [params, setParams, resetParams] = useQueryParam('/progress-quiz/:quizId')

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
