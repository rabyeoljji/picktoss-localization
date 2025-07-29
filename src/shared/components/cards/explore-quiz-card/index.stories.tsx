import { Meta, StoryObj } from '@storybook/react'

import { GetAllQuizzesDto } from '@/entities/quiz/api'

import { ExploreQuizCard } from '@/shared/components/cards/explore-quiz-card'

const quizzes = [
  {
    id: 0,
    name: 'picktoss',
    question: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수인가요?',
    answer: 'correct',
    explanation: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수',
    quizType: 'MIX_UP',
  },
  {
    id: 1,
    name: 'picktoss',
    question: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수인가요?',
    answer: 'correct',
    explanation: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수',
    quizType: 'MIX_UP',
  },
  {
    id: 2,
    name: 'picktoss',
    question: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수인가요?',
    answer: 'correct',
    explanation: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수',
    quizType: 'MIX_UP',
  },
] as GetAllQuizzesDto[]

const meta: Meta<typeof ExploreQuizCard> = {
  title: 'Card/ExploreQuizCard',
  component: ExploreQuizCard,
  parameters: {
    docs: {
      page: null,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-gray-100">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const Default: StoryObj<typeof ExploreQuizCard> = {
  render: () => {
    return (
      <div className="p-10 flex-center">
        <ExploreQuizCard>
          <ExploreQuizCard.Content>
            <ExploreQuizCard.Header
              emoji={'🪶'}
              title={'인지주의 심리학 관련 퀴즈 모음'}
              totalQuizCount={25}
              playedCount={345}
              bookmarkCount={28}
              isOwner={false}
              isBookmarked={false}
              onClickBookmark={() => {}}
            />
            <ExploreQuizCard.Quizzes onClickMoveToDetailPageBtn={() => {}} quizzes={quizzes} />
          </ExploreQuizCard.Content>
        </ExploreQuizCard>
      </div>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `
        <ExploreQuizCard>
          <ExploreQuizCard.Content>
            <ExploreQuizCard.Header
              emoji={'🪶'}
              title={'인지주의 심리학 관련 퀴즈 모음'}
              totalQuizCount={25}
              playedCount={345}
              bookmarkCount={28}
              isOwner={false}
              isBookmarked={false}
              onClickBookmark={() => {}}
            />
            <ExploreQuizCard.Quizzes onClickMoveToDetailPageBtn={() => {}} quizzes={quizzes} />
          </ExploreQuizCard.Content>
        </ExploreQuizCard>
        `,
      },
    },
  },
}

export const Bookmarked: StoryObj<typeof ExploreQuizCard> = {
  render: () => {
    return (
      <div className="p-10 flex-center">
        <ExploreQuizCard>
          <ExploreQuizCard.Content>
            <ExploreQuizCard.Header
              emoji={'🪶'}
              title={'인지주의 심리학 관련 퀴즈 모음'}
              totalQuizCount={25}
              playedCount={345}
              bookmarkCount={28}
              isOwner={false}
              isBookmarked={true}
              onClickBookmark={() => {}}
            />
            <ExploreQuizCard.Quizzes onClickMoveToDetailPageBtn={() => {}} quizzes={quizzes} />
          </ExploreQuizCard.Content>
        </ExploreQuizCard>
      </div>
    )
  },
}

export const Owner: StoryObj<typeof ExploreQuizCard> = {
  render: () => {
    return (
      <div className="p-10 flex-center">
        <ExploreQuizCard>
          <ExploreQuizCard.Content>
            <ExploreQuizCard.Header
              emoji={'🪶'}
              title={'인지주의 심리학 관련 퀴즈 모음'}
              totalQuizCount={25}
              playedCount={345}
              bookmarkCount={28}
              isOwner={true}
              isBookmarked={false}
              onClickBookmark={() => {}}
            />
            <ExploreQuizCard.Quizzes onClickMoveToDetailPageBtn={() => {}} quizzes={quizzes} />
          </ExploreQuizCard.Content>
        </ExploreQuizCard>
      </div>
    )
  },
}
