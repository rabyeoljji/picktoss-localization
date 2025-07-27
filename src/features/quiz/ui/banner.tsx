import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useUser } from '@/entities/member/api/hooks'

import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

import { MultipleChoiceOption } from './multiple-choice-option'

export const DailyGuide = () => {
  const router = useRouter()
  const { data: user } = useUser()

  const handleOptionClick = (type: string) => {
    if (type === 'file') {
      router.push('/note/create', {
        search: {
          documentType: 'FILE',
        },
      })
    }
    if (type === 'text') {
      router.push('/note/create', {
        search: {
          documentType: 'TEXT',
        },
      })
    }
    if (type === 'interest') {
      router.push('/explore', {
        search: {
          category: user?.category.id,
        },
      })
    }
    if (type === 'explore') {
      router.push('/explore')
    }
  }

  return (
    <HeaderOffsetLayout className="px-4">
      <div className="mt-2 shadow-md rounded-[24px] pt-[38px] px-4 bg-surface-1 min-h-[66svh]">
        <div className="text-center mb-[26px]">
          <div className="mb-3">
            <Tag size="md" className="mx-auto">
              데일리 이용 가이드
            </Tag>
          </div>
          <Text typo="question">
            퀴즈를 생성하거나 저장하면
            <br />
            여기에 랜덤으로 문제가 나타나요
          </Text>
        </div>

        <div className="space-y-2">
          <MultipleChoiceOption
            label="A"
            option="파일로 퀴즈 생성하기"
            selectedOption={null}
            isCorrect={false}
            animationDelay={0}
            onClick={() => handleOptionClick('file')}
          />
          <MultipleChoiceOption
            label="B"
            option="텍스트로 퀴즈 생성하기"
            selectedOption={null}
            isCorrect={false}
            animationDelay={100}
            onClick={() => handleOptionClick('text')}
          />
          <MultipleChoiceOption
            label="C"
            option="내 관심분야 퀴즈 보러가기"
            selectedOption={null}
            isCorrect={false}
            animationDelay={200}
            onClick={() => handleOptionClick('interest')}
          />
          <MultipleChoiceOption
            label="D"
            option="픽토스 전체 퀴즈 보러가기"
            selectedOption={null}
            isCorrect={false}
            animationDelay={300}
            onClick={() => handleOptionClick('explore')}
          />
        </div>
      </div>
    </HeaderOffsetLayout>
  )
}
