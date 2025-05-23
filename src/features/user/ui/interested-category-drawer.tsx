import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

import { useGetCategories } from '@/entities/category/api/hooks'
import { CategoryDto } from '@/entities/member/api'
import { useUpdateMemberCategory } from '@/entities/member/api/hooks'

import { IcChevronRight, IcClose } from '@/shared/assets/icon'
import { Button } from '@/shared/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'
import { Form, FormField, FormItem } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const interestedCategorySchema = z.object({
  category: z.number({ required_error: '관심 분야를 선택해주세요' }),
})

type InterestedCategoryValues = z.infer<typeof interestedCategorySchema>

const InterestedCategoryDrawer = ({ interestedCategory }: { interestedCategory?: CategoryDto }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const { data: categories } = useGetCategories()
  const { mutate, isPending } = useUpdateMemberCategory()

  const form = useForm<InterestedCategoryValues>({
    resolver: zodResolver(interestedCategorySchema),
    defaultValues: {
      category: interestedCategory?.id,
    },
  })

  const onSubmit = (values: InterestedCategoryValues) => {
    mutate(
      { categoryId: values.category },
      {
        onSuccess: () => {
          toast('관심 카테고리가 변경되었어요', {
            action: {
              label: '퀴즈 보러가기',
              onClick: () => router.push('/explore', { search: { category: values.category } }),
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

              {interestedCategory ? (
                <div className="flex items-center gap-[3px]">
                  {`${interestedCategory.emoji} ${interestedCategory.name}`}
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
            <form className="h-[calc(100%-24px)] flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="h-[calc(100%-114px)] flex flex-col">
                <DrawerHeader className="shrink-0">
                  <DrawerTitle className="text-h4 flex items-center justify-between">
                    관심 카테고리 선택
                    <DrawerClose>
                      <IcClose className="size-[24px] text-icon-secondary" />
                    </DrawerClose>
                  </DrawerTitle>
                </DrawerHeader>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <div className="flex flex-col max-h-[calc(100%-24px)] overflow-y-auto py-[22px]">
                      <FormItem className="h-fit">
                        <RadioGroup
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={String(field.value)}
                          defaultValue={String(interestedCategory?.id)}
                          className="flex flex-col"
                        >
                          {Array.isArray(categories) &&
                            categories.map((category) => (
                              <label
                                key={category.id}
                                className="flex items-center gap-[12px] py-[10px] cursor-pointer"
                              >
                                <RadioGroupItem value={String(category.id)} />
                                <Text typo="subtitle-2-medium">
                                  {category.emoji} {category.name}
                                </Text>
                              </label>
                            ))}
                        </RadioGroup>
                      </FormItem>
                    </div>
                  )}
                />
              </div>

              <DrawerFooter className="justify-self-end flex-center w-full flex-row pt-[14px] pb-[24px] shrink-0">
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
