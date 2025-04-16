import { useState } from 'react'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { IcAdd, IcArrange, IcDelete, IcProfile, IcSearch, IcUpload } from '@/shared/assets/icon'
import { BookmarkHorizontalCard } from '@/shared/components/cards/bookmark-horizontal-card'
import { SlidableNoteCard } from '@/shared/components/cards/slidable-note-card'
import { Header } from '@/shared/components/header'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Text } from '@/shared/components/ui/text'
import { Link, RoutePath, useQueryParam } from '@/shared/lib/router'

const NotesPage = () => {
  const [params, setParams] = useQueryParam(RoutePath.note)
  const activeTab = params.tab

  type Tab = typeof params.tab

  const setTab = (tab: typeof params.tab) => {
    setParams({ ...params, tab })
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
            <Tabs value={activeTab} onValueChange={(tab) => setTab(tab as Tab)}>
              <TabsList>
                <TabsTrigger
                  className="typo-button-2 text-secondary data-[state=active]:bg-inverse data-[state=active]:text-inverse rounded-full"
                  value={'MY' as Tab}
                >
                  내 퀴즈
                </TabsTrigger>
                <TabsTrigger
                  className="typo-button-2 text-secondary data-[state=active]:bg-inverse data-[state=active]:text-inverse rounded-full"
                  value={'BOOKMARK' as Tab}
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
        {/* {activeTab === 'my' && <EmptyMyNote />} */}

        {/* 2. 북마크한 퀴즈가 없을 경우 */}
        {/* {activeTab === 'bookmark' && <EmptyBookmarkQuiz />} */}

        {/* 3. 만든 노트 or 북마크한 퀴즈가 있을 경우 */}
        {activeTab === 'MY' ? <MyNotesContent /> : <BookmarkContents />}
      </HeaderOffsetLayout>
    </>
  )
}

const MyNotesContent = () => {
  const [selectMode, setSelectMode] = useState(false)

  return (
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="size-fit py-[10px] pl-[10px] flex-center cursor-pointer">
            <IcArrange className="size-[20px] text-icon-secondary" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>최근 오답 일자</DropdownMenuItem>
            <DropdownMenuItem>생성한 일자</DropdownMenuItem>
            <DropdownMenuItem>이름</DropdownMenuItem>
            <DropdownMenuItem>문제 수</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <SlidableNoteCard.Detail quizCount={28} playedCount={345} bookmarkCount={21} isShared={true} />
            </SlidableNoteCard.Content>
          </SlidableNoteCard>
        ))}
      </div>
    </div>
  )
}

const BookmarkContents = () => {
  return (
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="size-fit py-[10px] pl-[10px] flex-center cursor-pointer">
            <IcArrange className="size-[20px] text-icon-secondary" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>저장한 일자</DropdownMenuItem>
            <DropdownMenuItem>문제 수</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="py-[16px] h-fit w-full flex flex-col gap-[8px]">
        {Array.from({ length: 10 }).map((_, index) => (
          <Link key={index} to={RoutePath.noteDetail} params={[String(1)]}>
            <BookmarkHorizontalCard>
              <BookmarkHorizontalCard.Left content="📄" />

              <BookmarkHorizontalCard.Content>
                <BookmarkHorizontalCard.Header
                  title="금융투자분석사 노트정리"
                  isBookmarked={true}
                  onClickBookmark={() => alert('click bookmark')}
                />
                <BookmarkHorizontalCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
                <BookmarkHorizontalCard.Detail quizCount={28} playedCount={345} bookmarkCount={21} isShared={true} />
              </BookmarkHorizontalCard.Content>
            </BookmarkHorizontalCard>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default withHOC(NotesPage, {
  activeTab: '도서관',
  navClassName: 'border-t border-divider',
  backgroundClassName: 'bg-surface-2',
})
