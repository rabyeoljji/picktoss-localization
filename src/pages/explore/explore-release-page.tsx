import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { BackButton } from '@/shared/components/buttons/back-button'
// import { SelectableNoteCard } from '@/shared/components/cards/selectable-note-card'
import FixedBottom from '@/shared/components/fixed-bottom'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'

const ExploreReleasePage = () => {
  return (
    <>
      <Header className={'bg-surface-2 py-[7px] px-[8px]'} left={<BackButton />} title={'퀴즈 공개'} />

      <HeaderOffsetLayout className="flex flex-col pb-[calc(env(safe-area-inset-bottom)+90px)] h-full">
        <div className="flex flex-col gap-[8px] w-full p-[16px] pb-[12px]">
          <Text typo="h4">공개할 퀴즈를 선택해주세요</Text>
          <Text typo="body-1-medium" color="sub">
            내가 만든 퀴즈를 다른 사람들이 풀거나 저장할 수 있어요
          </Text>
        </div>

        <div className="px-[16px] py-[20px] flex flex-col flex-1 overflow-y-auto gap-[10px]">
          {/* {Array.from({ length: 10 }, (_, index) => (
            <SelectableNoteCard key={index}>
              <SelectableNoteCard.Left content="🪶" />
              <SelectableNoteCard.Content>
                <SelectableNoteCard.Header title="최근 이슈" />
                <SelectableNoteCard.Preview content="미리보기 문장 이러이러합니다 한줄 이내로 작성해주세요 미리보기 문장 이러이러합니다" />
                <SelectableNoteCard.Detail quizCount={28} />
              </SelectableNoteCard.Content>
            </SelectableNoteCard>
          ))} */}
        </div>

        <FixedBottom className="bg-surface-2">
          <Button>완료</Button>
        </FixedBottom>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(ExploreReleasePage, {
  backgroundClassName: 'bg-surface-2',
})
