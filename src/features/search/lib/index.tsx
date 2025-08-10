import { JSX } from 'react'

import { extractPlainText } from '@/features/note/lib'

import { Text, Typo } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

type Quiz = {
  question: string
  answer: string
  explanation: string
}

/** 퀴즈 객체 배열을 받아 문제와 정답, 해설을
 * 텍스트로 변환해 반환하는 컴포넌트
 */
export function formatQAText(quizzes: Quiz[]): string {
  return quizzes
    .map(
      (quiz) =>
        `Q. ${quiz.question} A. ${quiz.answer === 'correct' ? 'O' : quiz.answer === 'incorrect' ? 'X' : quiz.answer} | 해설: ${quiz.explanation}`,
    )
    .join(' ')
}

/** 마크다운 텍스트를 받아
 * 문법을 제거하고 키워드에 강조를 해서 반환하는 컴포넌트
 */
export const MarkdownProcessor = ({
  markdownText,
  keyword,
  typo,
  displayCharCount = 80,
  truncate,
}: {
  markdownText: string
  keyword: string
  typo: Typo
  displayCharCount?: number
  truncate?: boolean
}) => {
  const plainText = extractPlainText(markdownText)
  const highlightedText = highlightAndTrimText(plainText, keyword, typo, displayCharCount)

  return <div className={cn('w-full', truncate && 'truncate')}>{highlightedText}</div>
}

/**
 * 텍스트에서 키워드를 강조하는 함수
 */
export function highlightAndTrimText(
  text: string,
  keyword: string,
  typo: Typo,
  displayCharCount?: number,
): JSX.Element | string {
  if (!text) return text

  const totalLength = displayCharCount ?? 80
  const regex = new RegExp(`(${keyword})`, 'gi') // RegExp로 정규표현식 생성
  const match = text.match(regex)

  if (!keyword || !match) {
    // 키워드가 없으면 텍스트를 80자로 자르기
    const trimmedText = text.length > totalLength ? text.slice(0, totalLength) + '...' : text
    return trimmedText
  }

  // 첫 번째 매칭된 키워드의 위치
  const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase())

  // 키워드의 살짝 앞에서부터 잘라서 표시 (현재 설정 : 5글자 앞에서부터 표시)
  const prevCharCount = 5

  const start = Math.max(0, keywordIndex - prevCharCount)
  const end = Math.min(text.length, start + totalLength)

  const trimmedText = text.slice(start, end)

  // 앞뒤가 잘린 경우 생략 표시 추가
  const prefix = start > 0 ? '...' : ''
  const suffix = end < text.length ? '...' : ''

  // 텍스트 분리 및 강조 처리
  const parts = trimmedText.split(regex)

  return (
    <>
      {prefix}
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Text typo={typo} key={index} color="accent" className="inline-block size-fit">
            {part}
          </Text>
        ) : (
          part
        ),
      )}
      {suffix}
    </>
  )
}
