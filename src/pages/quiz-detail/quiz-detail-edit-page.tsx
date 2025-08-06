import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import EmojiPicker, { Theme } from 'emoji-picker-react'
import { toast } from 'sonner'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'
import NotFound from '@/app/not-found'

import { useGetCategories } from '@/entities/category/api/hooks'
import {
  useGetDocument,
  useUpdateDocumentCategory,
  useUpdateDocumentEmoji,
  useUpdateDocumentIsPublic,
  useUpdateDocumentName,
} from '@/entities/document/api/hooks'

import { BackButton } from '@/shared/components/buttons/back-button'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { Header } from '@/shared/components/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Switch } from '@/shared/components/ui/switch'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const QuizDetailEditPage = () => {
  const router = useRouter()

  const { noteId } = useParams()

  const { data: document, isLoading: isDocumentLoading, refetch: refetchDocument } = useGetDocument(Number(noteId))
  const { data: categories } = useGetCategories()

  // Form states
  const [emoji, setEmoji] = useState('')
  const [title, setTitle] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [isPublic, setIsPublic] = useState(false)

  // UI states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
  const [showPrivateConfirmDialog, setShowPrivateConfirmDialog] = useState(false)

  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // API mutations
  const { mutate: updateDocumentName, isPending: isUpdatingName } = useUpdateDocumentName()
  const { mutate: updateDocumentEmoji, isPending: isUpdatingEmoji } = useUpdateDocumentEmoji()
  const { mutate: updateDocumentCategory, isPending: isUpdatingCategory } = useUpdateDocumentCategory(Number(noteId))
  const { mutate: updateDocumentIsPublic, isPending: isUpdatingPublic } = useUpdateDocumentIsPublic(Number(noteId))

  // Initialize form with document data
  useEffect(() => {
    if (!document) return

    setEmoji(document.emoji || '📝')
    setTitle(document.name || '')
    setIsPublic(document.isPublic || false)

    // Set category ID based on category name
    if (document.category && categories) {
      const category = categories.find((cat) => cat.name === document.category)
      if (category) {
        setSelectedCategoryId(category.id)
      }
    }
  }, [document, categories])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    addEventListener('mousedown', handleClickOutside)
    return () => {
      removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedCategory = categories?.find((cat) => cat.id === selectedCategoryId)

  const handleSave = async () => {
    if (!document) return

    const promises = []

    // Update emoji if changed
    if (emoji !== document.emoji) {
      promises.push(
        new Promise((resolve, reject) => {
          updateDocumentEmoji(
            {
              documentId: Number(noteId),
              data: { emoji },
            },
            {
              onSuccess: resolve,
              onError: reject,
            },
          )
        }),
      )
    }

    // Update title if changed
    if (title !== document.name) {
      promises.push(
        new Promise((resolve, reject) => {
          updateDocumentName(
            {
              documentId: Number(noteId),
              data: { name: title },
            },
            {
              onSuccess: resolve,
              onError: reject,
            },
          )
        }),
      )
    }

    // Update category if changed
    const currentCategoryId = categories?.find((cat) => cat.name === document.category)?.id
    if (selectedCategoryId && selectedCategoryId !== currentCategoryId) {
      promises.push(
        new Promise((resolve, reject) => {
          updateDocumentCategory(
            { categoryId: selectedCategoryId },
            {
              onSuccess: resolve,
              onError: reject,
            },
          )
        }),
      )
    }

    // Update public status if changed
    if (isPublic !== document.isPublic) {
      promises.push(
        new Promise((resolve, reject) => {
          updateDocumentIsPublic(
            { isPublic },
            {
              onSuccess: resolve,
              onError: reject,
            },
          )
        }),
      )
    }

    try {
      await Promise.all(promises)
      toast('퀴즈 정보가 저장되었습니다')
      await refetchDocument()
      router.back()
    } catch (error) {
      toast('저장 중 오류가 발생했습니다')
    }
  }

  const handlePublicToggle = (checked: boolean) => {
    setIsPublic(checked)
  }

  const isLoading = isUpdatingName || isUpdatingEmoji || isUpdatingCategory || isUpdatingPublic
  const hasPublicChange = isPublic !== (document?.isPublic || false)

  if (isDocumentLoading) return null

  if (!isDocumentLoading && !document?.isOwner) {
    return <NotFound />
  }

  return (
    <div className="relative flex flex-col h-screen bg-base-1">
      <Header
        left={<BackButton />}
        content={
          <Text typo="subtitle-2-medium" className="text-center">
            퀴즈 정보
          </Text>
        }
      />

      <HeaderOffsetLayout className="flex-1 overflow-auto pt-[54px]">
        <div className="px-4 py-3 bg-surface-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Text typo="body-1-medium">공개 퀴즈</Text>
            <Text typo="body-2-medium" color="caption">
              *다른 사람들도 퀴즈를 풀어볼 수 있어요
            </Text>
          </div>
          <Switch checked={isPublic} onCheckedChange={handlePublicToggle} />
        </div>

        <div className="px-4 py-5 flex flex-col gap-[24px]">
          <div className="flex items-center gap-2">
            <div ref={emojiPickerRef} className="relative size-[88px] flex-center rounded-xl">
              {isDocumentLoading ? (
                <Skeleton className="size-[48px]" />
              ) : (
                <div className="text-[56px] flex-center size-full relative">{emoji}</div>
              )}
              {showEmojiPicker && (
                <div className="absolute top-full bg-base-1 z-50 left-0 mt-1 border border-outline rounded-lg shadow-lg">
                  <EmojiPicker
                    onEmojiClick={(data) => {
                      setShowEmojiPicker(false)
                      setEmoji(data.emoji)
                    }}
                    theme={Theme.LIGHT}
                    width={300}
                    height={400}
                  />
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowEmojiPicker(true)}
              size="md"
              variant="tertiary"
              className="w-fit h-[28px] w-[60px]"
            >
              변경
            </Button>
          </div>

          <div className="space-y-2">
            <Text typo="body-1-bold" color="sub">
              퀴즈 제목 <span className="text-accent">*</span>
            </Text>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="퀴즈 제목을 입력해주세요" />
          </div>

          <div className="space-y-2">
            <Text typo="body-1-bold" color="sub">
              카테고리 <span className="text-accent">*</span>
            </Text>
            <div className="flex items-center gap-5">
              <Text typo="subtitle-2-medium" color="secondary">
                {selectedCategory?.name}
              </Text>
              <AlertDrawer
                trigger={
                  <Button
                    onClick={() => setCategoryDrawerOpen(true)}
                    size="md"
                    variant="tertiary"
                    className="w-fit h-[28px] w-[60px]"
                  >
                    변경
                  </Button>
                }
                open={categoryDrawerOpen}
                onOpenChange={setCategoryDrawerOpen}
                hasClose
                title="카테고리 변경"
                body={
                  <div className="py-8">
                    <RadioGroup
                      onValueChange={(value) => setSelectedCategoryId(Number(value))}
                      value={selectedCategoryId ? String(selectedCategoryId) : undefined}
                      className="flex flex-col"
                    >
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <label key={category.id} className="flex items-center gap-3 py-3 cursor-pointer">
                            <RadioGroupItem value={String(category.id)} />
                            <Text typo="subtitle-2-medium">
                              {category.emoji} {category.name}
                            </Text>
                          </label>
                        ))}
                    </RadioGroup>
                  </div>
                }
                footer={
                  <div className="h-[114px] pt-[14px]">
                    <Button
                      onClick={() => {
                        setCategoryDrawerOpen(false)
                      }}
                      disabled={!selectedCategoryId}
                    >
                      완료
                    </Button>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </HeaderOffsetLayout>

      {/* 비공개 확인 다이얼로그 */}
      <SystemDialog
        open={showPrivateConfirmDialog}
        onOpenChange={setShowPrivateConfirmDialog}
        title="퀴즈를 비공개로 처리하시겠어요?"
        content={
          <Text typo="body-1-medium" color="sub">
            내 퀴즈 공유가 불가능하며,
            <br />
            다른 사람들의 풀이 및 저장 정보가 삭제돼요
          </Text>
        }
        variant="critical"
        confirmLabel="확인"
        onConfirm={() => {
          setShowPrivateConfirmDialog(false)
          handleSave()
        }}
      />

      {/* 저장 버튼 */}
      <div className="pb-[40px] bg-base-1">
        <Button
          onClick={() => {
            if (hasPublicChange && isPublic === false) {
              setShowPrivateConfirmDialog(true)
              return
            }
            handleSave()
          }}
          disabled={
            !title.trim() ||
            !selectedCategoryId ||
            isDocumentLoading ||
            isLoading ||
            isUpdatingName ||
            isUpdatingEmoji ||
            isUpdatingCategory ||
            isUpdatingPublic
          }
          className="w-full"
        >
          {isLoading ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  )
}

export default withHOC(QuizDetailEditPage, {})
