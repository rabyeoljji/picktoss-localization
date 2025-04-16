import { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { useCreateNoteContext } from '@/features/note/model/create-note-context'

import { useGetCategories } from '@/entities/category/api/hooks'

import { IcCheck, IcChevronDown, IcChevronUp } from '@/shared/assets/icon'
import { ImgStar } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/shared/components/ui/drawer'
import { Switch } from '@/shared/components/ui/switch'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

export const CreateNoteDrawer = () => {
  const { data: categories } = useGetCategories()
  const {
    categoryId,
    setCategoryId,
    handleCreateDocument,
    checkCreateActivate,
    isPublic,
    setIsPublic,
    quizType,
    setQuizType,
    star,
    isPending,
  } = useCreateNoteContext()

  const [open, setOpen] = useState(false)
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true)
  const [isQuizTypeExpanded, setIsQuizTypeExpanded] = useState(true)

  const toggleCategoryExpand = () => setIsCategoryExpanded((prev) => !prev)
  const toggleQuizTypeExpand = () => setIsQuizTypeExpanded((prev) => !prev)

  const selectedCategory = categories?.find((category) => category.id === categoryId)

  return (
    <Drawer open={open || isPending} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="special"
          right={
            <div className="flex-center size-[fit] rounded-full bg-[#D3DCE4]/[0.2] px-[8px]">
              <ImgStar className="size-[16px] mr-[4px]" />
              <Text typo="body-1-medium">{star}</Text>
            </div>
          }
        >
          생성하기
        </Button>
      </DrawerTrigger>
      <DrawerContent height="md">
        <div className={cn('overflow-y-scroll p-4', checkCreateActivate() && 'pb-[114px]')}>
          <div className="grid gap-2">
            <div className="border rounded-[12px] bg-surface-1 border-outline">
              {/* Trigger */}
              <button
                onClick={toggleCategoryExpand}
                className="w-full py-[14px] flex justify-between px-5 items-center typo-subtitle-2-bold focus:outline-none"
              >
                <span>
                  {selectedCategory && !isCategoryExpanded
                    ? `${selectedCategory?.emoji}\u00A0\u00A0${selectedCategory?.name}`
                    : '카테고리'}
                </span>
                {isCategoryExpanded ? (
                  <IcChevronUp className="size-4 text-icon-secondary" />
                ) : (
                  <IcChevronDown className="size-4 text-icon-secondary" />
                )}
              </button>
              <AnimatePresence>
                {isCategoryExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* 카테고리 버튼 리스트 */}
                    <div className="flex flex-col">
                      {categories?.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setCategoryId(category.id)
                            setIsCategoryExpanded(false)
                          }}
                          className="w-full px-4 py-[14px] hover:bg-gray-100 focus:outline-none text-left flex items-center justify-between"
                        >
                          <span>{`${category.emoji}\u00A0\u00A0${category.name}`}</span>
                          {category.id === categoryId && <IcCheck className="size-6 text-icon-accent" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border rounded-[12px] bg-surface-1 border-outline">
              <button
                onClick={toggleQuizTypeExpand}
                className="w-full py-[14px] flex justify-between px-5 items-center typo-subtitle-2-bold focus:outline-none"
              >
                <span>
                  {quizType && !isQuizTypeExpanded ? `${quizType === 'MIX_UP' ? 'O/X' : '객관식'}` : '문제 유형'}
                </span>
                {isQuizTypeExpanded ? (
                  <IcChevronUp className="size-4 text-icon-secondary" />
                ) : (
                  <IcChevronDown className="size-4 text-icon-secondary" />
                )}
              </button>
              <AnimatePresence>
                {isQuizTypeExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col">
                      {[
                        { value: 'MIX_UP', label: 'O/X' },
                        { value: 'MULTIPLE_CHOICE', label: '객관식' },
                      ]?.map((qt) => (
                        <button
                          key={qt.value}
                          onClick={() => {
                            setQuizType(qt.value as 'MIX_UP' | 'MULTIPLE_CHOICE')
                            setIsQuizTypeExpanded(false)
                          }}
                          className="w-full px-4 py-[14px] hover:bg-gray-100 focus:outline-none text-left flex items-center justify-between"
                        >
                          <span>{qt.label}</span>
                          {qt.value === quizType && <IcCheck className="size-6 text-icon-accent" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between px-2 py-[12px]">
              <div className="flex gap-2 items-end">
                <Text typo="body-1-bold" color="secondary">
                  퀴즈 공개
                </Text>
                <Text typo="body-2-medium" color="caption">
                  {isPublic ? '*다른 사람들도 퀴즈를 풀어볼 수 있어요' : '*이 퀴즈를 나만 볼 수 있어요'}
                </Text>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>
        </div>
        {checkCreateActivate() && (
          <div className="pb-12 pt-[14px] mt-auto px-1">
            <Button
              variant="special"
              onClick={handleCreateDocument}
              disabled={isPending}
              right={
                <div className="flex-center size-[fit] rounded-full bg-[#D3DCE4]/[0.2] px-[8px]">
                  <ImgStar className="size-[16px] mr-[4px]" />
                  <Text typo="body-1-medium">{star}</Text>
                </div>
              }
            >
              완료
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
