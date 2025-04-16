import { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { useCreateNoteContext } from '@/features/note/model/create-note-context'

import { useGetCategories } from '@/entities/category/api/hooks'

import { ImgStar } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/shared/components/ui/drawer'
import { Text } from '@/shared/components/ui/text'

export const CreateNoteDrawer = () => {
  const { data: categories } = useGetCategories()
  const { categoryId, setCategoryId, handleCreateDocument, quizType, setQuizType, star, isPending } =
    useCreateNoteContext()

  const [open, setOpen] = useState(false)
  // isExpanded 상태는 카테고리 목록의 열림/닫힘을 제어합니다.
  const [isExpanded, setIsExpanded] = useState(false)

  // 토글 함수: 카테고리 목록의 펼침 상태를 반전시킵니다.
  const toggleExpand = () => setIsExpanded((prev) => !prev)

  const selectedCategory = categories?.find((category) => category.id === categoryId)

  return (
    <Drawer open={open || isPending} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="special"
          disabled={isPending}
          right={
            <div className="flex-center size-[fit] rounded-full bg-[#D3DCE4]/[0.2] px-[8px]">
              <ImgStar className="size-[16px] mr-[4px]" />
              <Text typo="body-1-medium">{star}</Text>
            </div>
          }
        >
          {isPending ? '생성 중...' : '생성하기'}
        </Button>
      </DrawerTrigger>
      <DrawerContent height="md">
        <div className="overflow-y-scroll p-4">
          <div className="border rounded-[12px] bg-surface-1 border-outline">
            {/* 제목 영역: 클릭하면 목록이 펼쳐지거나 접힙니다. */}
            <button
              onClick={toggleExpand}
              className="w-full py-[14px] flex justify-between px-5 items-center typo-subtitle-2-bold focus:outline-none"
            >
              {selectedCategory ? `${selectedCategory.emoji}\u00A0\u00A0${selectedCategory.name}` : '카테고리'}
            </button>
            {/* AnimatePresence를 사용해 조건부 렌더링된 영역에 애니메이션을 추가 */}
            <AnimatePresence>
              {isExpanded && (
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
                          // 카테고리 선택 후 목록을 닫고 싶다면 아래와 같이 상태를 변경할 수 있습니다.
                          setIsExpanded(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
