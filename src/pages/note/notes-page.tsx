import { useState } from 'react'
import { useSearchParams } from 'react-router'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { IcAdd, IcArrange, IcDelete, IcProfile, IcSearch, IcUpload } from '@/shared/assets/icon'
import { SlidableNoteCard } from '@/shared/components/cards/slidable-note-card'
// import { ImgNoteEmpty } from '@/shared/assets/images'
import { Header } from '@/shared/components/header'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Text } from '@/shared/components/ui/text'
import { Link, RoutePath } from '@/shared/lib/router'

type Tab = 'my' | 'bookmark'
const TabValues = ['my', 'bookmark']

const NotesPage = () => {
  const [selectMode, setSelectMode] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()
  const paramsTab = searchParams.get('tab') ?? ''

  const activeTab = TabValues.includes(paramsTab) ? (paramsTab as Tab) : 'my'

  const setTab = (tab: Tab) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('tab', tab)
    setSearchParams(newSearchParams)
  }

  return (
    <>
      <Header
        className="bg-surface-2 py-[9px] px-[8px]"
        left={
          <button className="size-[40px] flex-center">
            <IcProfile className="size-[24px] text-icon-secondary" />
          </button>
        }
        right={
          <button className="size-[40px] flex-center">
            <IcAdd className="size-[24px] text-icon-secondary" />
          </button>
        }
        content={
          <div className="center">
            <Tabs value={activeTab} onValueChange={(tab) => TabValues.includes(tab) && setTab(tab as Tab)}>
              <TabsList>
                <TabsTrigger
                  className="typo-button-2 text-secondary data-[state=active]:bg-inverse data-[state=active]:text-inverse rounded-full"
                  value={'my'}
                >
                  내 퀴즈
                </TabsTrigger>
                <TabsTrigger
                  className="typo-button-2 text-secondary data-[state=active]:bg-inverse data-[state=active]:text-inverse rounded-full"
                  value={'bookmark'}
                >
                  북마크
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      />

      <HeaderOffsetLayout className="size-full">
        {/* 1. 만든 노트가 없을 경우 */}
        {/* <EmptyMyNote/> */}

        {/* 2. 만든 노트가 있을 경우 */}
        <div className="size-full flex flex-col px-[16px] pt-[16px] overflow-y-auto">
          <div className="w-full flex items-center">
            <Link
              to={RoutePath.noteSearch}
              className="h-[40px] flex-1 bg-base-3 py-[8px] px-[10px] flex items-center gap-[4px] rounded-full"
            >
              <IcSearch className="size-[20px] text-icon-secondary" />
              <Text typo="subtitle-2-medium" color="caption">
                퀴즈 제목, 내용 검색
              </Text>
            </Link>

            <button className="size-fit py-[10px] pl-[10px] flex-center">
              <IcArrange className="size-[20px] text-icon-secondary" />
            </button>
          </div>

          <div className="py-[16px] h-fit w-full flex flex-col gap-[8px]">
            {Array.from({ length: 10 }).map((_, index) => (
              <SlidableNoteCard
                key={index}
                id={index}
                selectMode={selectMode}
                changeSelectMode={setSelectMode}
                onSelect={() => {}}
                onClick={() => {}}
                swipeOptions={[
                  <button className="flex-center w-[72px] flex-col bg-orange p-2 text-inverse">
                    <IcUpload className="mb-[4px] text-inverse" />
                    <Text typo="body-1-medium" color="inverse" className="size-fit">
                      공유
                    </Text>
                  </button>,
                  <button className="flex-center w-[72px] flex-col bg-critical p-2 text-inverse">
                    <IcDelete className="mb-[4px]" />
                    <Text typo="body-1-medium" color="inverse" className="size-fit">
                      삭제
                    </Text>
                  </button>,
                ]}
              >
                <SlidableNoteCard.Left
                  content="📄"
                  checkBox={<Checkbox id={`note_${index}`} className="mx-[8px] size-[20px]" />}
                  selectMode={selectMode}
                />

                <SlidableNoteCard.Content>
                  <SlidableNoteCard.Header title="금융투자분석사 노트정리" />
                  <SlidableNoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
                  <SlidableNoteCard.Detail quizCount={28} playedCount={345} bookmarkCount={21} isShared />
                </SlidableNoteCard.Content>
              </SlidableNoteCard>
            ))}
          </div>
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(NotesPage, {
  activeTab: '도서관',
  navClassName: 'border-t border-divider',
  backgroundColor: 'bg-surface-2',
})
