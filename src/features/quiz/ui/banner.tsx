import { useTranslation } from 'react-i18next'

import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useUser } from '@/entities/member/api/hooks'

import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

import { MultipleChoiceOption } from './multiple-choice-option'

export const DailyGuide = () => {
  const router = useRouter()
  const { data: user } = useUser()

  const { t } = useTranslation()

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
              {t('daily.quiz_guide.daily_guide')}
            </Tag>
          </div>
          <Text typo="question">
            {t('daily.quiz_guide.daily_guide_message1')}
            <br />
            {t('daily.quiz_guide.daily_guide_message2')}
          </Text>
        </div>

        <div className="space-y-2">
          <MultipleChoiceOption
            label="A"
            option={t('daily.quiz_guide.generate_file')}
            selectedOption={null}
            isCorrect={false}
            animationDelay={0}
            onClick={() => handleOptionClick('file')}
          />
          <MultipleChoiceOption
            label="B"
            option={t('daily.quiz_guide.generate_text')}
            selectedOption={null}
            isCorrect={false}
            animationDelay={100}
            onClick={() => handleOptionClick('text')}
          />
          <MultipleChoiceOption
            label="C"
            option={t('daily.quiz_guide.explore_my_topics')}
            selectedOption={null}
            isCorrect={false}
            animationDelay={200}
            onClick={() => handleOptionClick('interest')}
          />
          <MultipleChoiceOption
            label="D"
            option={t('daily.quiz_guide.explore_all_quizzes')}
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
