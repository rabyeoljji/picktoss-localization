export const QUESTIONS_PER_THOUSAND = 2

export const calculateAvailableQuizCount = (charCount: number) => {
  // 문제 수 계산
  const quizCount = Math.floor((charCount / 1000) * QUESTIONS_PER_THOUSAND)
  return quizCount
}
