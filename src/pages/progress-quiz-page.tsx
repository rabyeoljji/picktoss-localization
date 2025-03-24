// import { useQueryParam } from '@/shared/lib/query-param'
import { useQueryParam } from '@/shared/lib/router/query-param'

export const ProgressQuizPage = () => {
  // 제네릭 타입을 명시하지 않고 자동 타입 추론 사용
  const [name, setName] = useQueryParam('name', '유민')

  console.log(name) // '유민' 또는 '정우'

  return (
    <div>
      <h1>프로그레스 퀴즈</h1>
      <p>현재 선택된 이름: {name}</p>
      <button onClick={() => setName(name === '유민' ? '정우' : '유민')}>이름 변경</button>
    </div>
  )
}
