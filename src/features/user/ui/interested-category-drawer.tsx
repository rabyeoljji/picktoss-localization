import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

import { useUpdateInterestCollectionCategories } from '@/entities/member/api/hooks'

import { IcChevronRight, IcClose } from '@/shared/assets/icon'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'
import { Form, FormControl, FormField, FormItem } from '@/shared/components/ui/form'
import { Text } from '@/shared/components/ui/text'
import { CATEGORIES, CategoryEnum } from '@/shared/config'

const interestedCategorySchema = z.object({
  categories: z.array(z.string()).min(1, '최소 1개의 관심분야를 선택해주세요').max(2, '최대 2개까지 선택 가능합니다'),
})

type InterestedCategoryValues = z.infer<typeof interestedCategorySchema>

const InterestedCategoryDrawer = ({
  interestedCategories,
}: {
  interestedCategories?: (CategoryEnum | '관심 분야 없음')[]
}) => {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useUpdateInterestCollectionCategories()

  const isExistInterestedCategory = useMemo(
    () => interestedCategories && interestedCategories.length !== 0 && interestedCategories[0] !== '관심 분야 없음',
    [interestedCategories],
  )

  const firstCategoryString = CATEGORIES.find((category) => category.key === interestedCategories?.[0])?.name
  const secondCategoryString = CATEGORIES.find((category) => category.key === interestedCategories?.[1])?.name
  const otherCategories = (interestedCategories?.length ?? 0) > 2 ? `외 ${(interestedCategories?.length ?? 0) - 1}` : ''

  const form = useForm<InterestedCategoryValues>({
    resolver: zodResolver(interestedCategorySchema),
    defaultValues: {
      categories: interestedCategories?.filter((category) => category !== '관심 분야 없음') || [],
    },
  })

  const onSubmit = (values: InterestedCategoryValues) => {
    mutate(
      { interestCollectionCategories: values.categories as NonNullable<CategoryEnum>[] },
      {
        onSuccess: () => {
          toast('관심분야가 설정되었어요', {
            action: {
              label: '퀴즈 보러가기',
              onClick: () => alert('clicked 퀴즈 보러가기'), // TODO: library 해당 카테고리로 이동
            },
          })
          setOpen(false)
        },
      },
    )
  }

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open) {
            form.reset()
          }
        }}
      >
        <DrawerTrigger asChild>
          <button className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start gap-[4px]">
              <Text typo="body-1-medium" color="sub">
                관심분야
              </Text>

              {isExistInterestedCategory ? (
                <div className="flex items-center gap-[3px]">
                  {`${firstCategoryString}, ${secondCategoryString} ${otherCategories}`}
                </div>
              ) : (
                <Text typo="subtitle-2-medium" color="accent">
                  내가 관심있는 분야를 설정해보세요
                </Text>
              )}
            </div>
            <IcChevronRight className="size-[16px] text-icon-sub" />
          </button>
        </DrawerTrigger>

        <DrawerContent
          hasHandle={false}
          height="lg"
          className="mx-auto flex flex-col px-[20px]"
          onPointerDownOutside={(e) => {
            if (isPending) {
              e.preventDefault()
            }
          }}
        >
          <Form {...form}>
            <form className="h-[calc(100%-24px)]" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col">
                <header className="shrink-0">
                  <DrawerTitle className="text-h4 flex items-center justify-between">
                    관심분야 선택
                    <DrawerClose>
                      <IcClose className="size-[24px] text-icon-secondary" />
                    </DrawerClose>
                  </DrawerTitle>
                  <Text typo="subtitle-2-medium" color="sub">
                    선택한 분야의 퀴즈를 모아볼 수 있어요
                  </Text>
                </header>

                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <div className="flex flex-col overflow-y-auto max-h-[510px] py-[32px]">
                      <FormItem>
                        {CATEGORIES.map((category) => (
                          <label key={category.key} className="flex cursor-pointer items-center py-[10px]">
                            <FormControl>
                              <Checkbox
                                id={category.key}
                                checked={field.value.includes(category.key)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, category.key]
                                    : field.value.filter((val) => val !== category.key)
                                  field.onChange(newValue)
                                }}
                                className="mr-[12px] size-[20px]"
                              />
                            </FormControl>
                            <Text typo="subtitle-2-medium">{category.name}</Text>
                          </label>
                        ))}
                      </FormItem>
                    </div>
                  )}
                />
              </div>

              <DrawerFooter className="flex-center w-full flex-row pt-[14px] pb-[24px] shrink-0">
                <div className="pb-[24px] w-full">
                  <Button type="submit" disabled={isPending} size={'lg'}>
                    저장하기
                  </Button>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default InterestedCategoryDrawer
