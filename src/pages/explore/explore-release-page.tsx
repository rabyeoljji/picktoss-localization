import { useState } from 'react'

import { toast } from 'sonner'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { extractPlainText } from '@/features/note/lib'

import { useGetIsNotPublicDocuments, useUpdateDocumentIsPublic } from '@/entities/document/api/hooks'

import { BackButton } from '@/shared/components/buttons/back-button'
import { SelectableNoteCard } from '@/shared/components/cards/selectable-note-card'
import FixedBottom from '@/shared/components/fixed-bottom'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

const ExploreReleasePage = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const { data } = useGetIsNotPublicDocuments()

  const [selectedId, setSelectedId] = useState<number>()
  const { mutate: updatePublic } = useUpdateDocumentIsPublic(selectedId ?? 0)

  const handleSelect = (id: number) => {
    if (selectedId === id) {
      setSelectedId(undefined)
    } else {
      setSelectedId(id)
    }
  }

  const handleRelease = () => {
    if (selectedId) {
      updatePublic(
        { isPublic: true },
        {
          onSuccess: () => {
            toast(t('explore.퀴즈가_공개되었어요'))
            router.replace('/quiz-detail/:noteId', { params: [String(selectedId)] })
          },
        },
      )
    }
  }

  return (
    <>
      <Header className={'bg-surface-2 py-[7px] px-[8px]'} left={<BackButton />} title={t('explore.퀴즈_공개')} />

      <HeaderOffsetLayout className="flex flex-col pb-[calc(env(safe-area-inset-bottom)+90px)] h-full">
        <div className="flex flex-col gap-[8px] w-full p-[16px] pb-[12px]">
          <Text typo="h4">{t('explore.공개할_퀴즈를_선택해주세요')}</Text>
          <Text typo="body-1-medium" color="sub">
            {t('explore.내가_만든_퀴즈를_다른_사람들이_풀거나_저장할_수_있어요')}
          </Text>
        </div>

        <div className="px-[16px] py-[20px] flex flex-col flex-1 overflow-y-auto gap-[10px]">
          {data?.documents.map((document) => (
            <SelectableNoteCard
              key={document.id}
              onClick={() => handleSelect(document.id)}
              isSelected={document.id === selectedId}
            >
              <SelectableNoteCard.Left content={document.emoji} />
              <SelectableNoteCard.Content>
                <SelectableNoteCard.Header title={document.name} />
                <SelectableNoteCard.Preview content={extractPlainText(document.previewContent)} />
                <SelectableNoteCard.Detail quizCount={document.totalQuizCount} />
              </SelectableNoteCard.Content>
            </SelectableNoteCard>
          ))}
        </div>

        <FixedBottom className="bg-surface-2">
          <Button disabled={!selectedId} onClick={handleRelease}>
            {t('explore.완료')}
          </Button>
        </FixedBottom>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(ExploreReleasePage, {
  backgroundClassName: 'bg-surface-2',
})
