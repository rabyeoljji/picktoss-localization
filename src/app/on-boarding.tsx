import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { z } from 'zod'

import { useOnboardingStore } from '@/features/onboarding/model/onboarding-store'

// import { withHOC } from '@/app/hoc/with-page-config'

import { useGetCategories } from '@/entities/category/api/hooks'
import { useUpdateMemberCategory, useUser } from '@/entities/member/api/hooks'

import { SelectCard } from '@/shared/components/cards/select-card'
import FixedBottom from '@/shared/components/fixed-bottom'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Text } from '@/shared/components/ui/text'
import { OnboardCompleteClickProps, useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useRouter } from '@/shared/lib/router'

const categorySchema = z.object({
  categoryId: z.string().nonempty(''),
})

type CategoryForm = z.infer<typeof categorySchema>

const OnBoardingPage = () => {
  const { trackEvent } = useAmplitude()
  const { t } = useTranslation()
  const router = useRouter()

  const { data: user } = useUser()
  const { data: categories } = useGetCategories()
  const { mutate: updateCategory } = useUpdateMemberCategory()
  const { setOnboardingCompleted } = useOnboardingStore()

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    mode: 'onChange',
  })

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = form

  const selectedCategoryId = watch('categoryId')

  const onSubmit = (data: CategoryForm) => {
    updateCategory(
      { categoryId: Number(data.categoryId) },
      {
        onSuccess: () => {
          trackEvent('onboard_complete_click', {
            category: categories?.find((category) => category.id === Number(data.categoryId))
              ?.name as OnboardCompleteClickProps['category'],
          })
          setOnboardingCompleted()
          router.replace('/')
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fixed top-0 pt-[var(--safe-area-inset-top)] left-1/2 -translate-x-1/2 size-full max-w-xl overflow-hidden bg-surface-2 z-[9999]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.8,
            type: 'spring',
            mass: 1,
            stiffness: 80,
            damping: 20,
          }}
          className="flex flex-col gap-[48px] pt-[66px] px-[16px] overflow-y-auto"
        >
          <div className="w-full max-w-[324px] inline-flex flex-col justify-start items-start gap-3">
            <div className="flex flex-col justify-start items-start gap-1">
              <Text typo="h2" color="sub" className="flex-center text-center justify-start leading-9">
                {t('etc.onboarding.user_name', { name: user?.name })}
              </Text>
              <Text typo="h2" className="text-center justify-start leading-9">
                {t('etc.onboarding.current_field_message')}
              </Text>
              <Text typo="h2" className="text-center justify-start leading-9">
                {t('etc.onboarding.studying_message')}
              </Text>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <Text typo="subtitle-2-medium" color="sub" className="self-stretch justify-start leading-normal">
                {t('etc.onboarding.select_field_message')}
              </Text>
            </div>
          </div>

          <div className="h-[calc(100svh-152px-66px-48px-114px)] overflow-y-scroll">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-wrap gap-2">
                    <motion.div
                      initial={{ opacity: 0, y: 70 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.8,
                        type: 'spring',
                        mass: 1,
                        stiffness: 80,
                        damping: 20,
                      }}
                      className="w-full grid grid-cols-2 grid-rows-3 gap-[8px]"
                    >
                      {categories?.map((category) => (
                        <FormItem key={category.id}>
                          <FormControl>
                            <RadioGroupItem
                              value={String(category.id)}
                              id={`category-${category.id}`}
                              className="peer sr-only"
                            />
                          </FormControl>
                          <SelectCard
                            htmlFor={`category-${category.id}`}
                            onClick={() => setValue('categoryId', String(category.id), { shouldValidate: true })}
                            selected={selectedCategoryId === String(category.id)}
                            className="h-[110px] w-full flex-col gap-[4px]"
                          >
                            <Text typo="h2">{category.emoji}</Text>
                            <Text typo="body-1-bold">{category.name}</Text>
                          </SelectCard>
                        </FormItem>
                      ))}
                    </motion.div>
                  </RadioGroup>
                </FormItem>
              )}
            />
          </div>

          <FixedBottom className="bg-surface-2">
            <div className="pb-[24px]">
              <Button type="submit" disabled={!isValid}>
                {t('etc.onboarding.complete_button')}
              </Button>
            </div>
          </FixedBottom>
        </motion.div>
      </form>
    </Form>
  )
}

export default OnBoardingPage

// export default withHOC(OnBoardingPage, {
//   backgroundClassName: 'bg-surface-2',
// })
