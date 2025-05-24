import { format } from 'date-fns'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { StarHistorySortType } from '@/entities/star/api'
import { useGetStarHistory } from '@/entities/star/api/hooks'

import { IcCheck, IcChevronDown } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import Loading from '@/shared/components/ui/loading'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam } from '@/shared/lib/router'

type SortOption = 'ALL' | 'WITHDRAWAL' | 'DEPOSIT'
const sortOption = [
  {
    key: 'ALL',
    label: '전체',
  },
  {
    key: 'WITHDRAWAL',
    label: '사용',
  },
  {
    key: 'DEPOSIT',
    label: '획득',
  },
]

const StarHistoryPage = () => {
  const [sort, setSort] = useQueryParam('/account/star-history', 'sort')

  const { data: starHistoryData, isLoading } = useGetStarHistory(sort === 'ALL' ? undefined : sort)

  return (
    <>
      <Header left={<BackButton />} />

      <HeaderOffsetLayout className="h-full">
        <div className="p-[16px] flex flex-col gap-[24px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="h-fit w-[56px] flex items-center gap-1 cursor-pointer">
                <Text typo="subtitle-2-bold" color="secondary">
                  {sortOption.find((option) => option.key === sort)?.label}
                </Text>
                <IcChevronDown className="size-[16px] text-icon-sub" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {sortOption.map((option) => (
                <DropdownMenuItem
                  onClick={() => setSort(option.key as SortOption)}
                  right={sort === option.key && <IcCheck className="size-[20px]" />}
                  className="cursor-pointer"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoading ? (
            <Loading center />
          ) : (
            starHistoryData && (
              <div className="flex flex-col gap-[16px]">
                {starHistoryData?.starHistories.map((historyItem) => (
                  <StarHistoryItem
                    date={historyItem.createdAt}
                    description={historyItem.description}
                    type={historyItem.transactionType}
                    amount={historyItem.changeAmount}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(StarHistoryPage, {})

const StarHistoryItem = ({
  date,
  type,
  description,
  amount,
}: {
  date: string
  type: StarHistorySortType
  description: string
  amount: number
}) => {
  return (
    <div className="py-[12px] flex items-center justify-between">
      <div className="flex items-center gap-[20px]">
        <Text typo="body-1-bold" color="sub" className="w-[40px]">
          {format(new Date(date), 'M.d')}
        </Text>
        <Text typo="subtitle-2-bold">{description}</Text>
      </div>

      <Text typo="subtitle-1-bold" color={type === 'DEPOSIT' ? 'accent' : 'secondary'}>
        {type === 'WITHDRAWAL' && '-'}
        {amount} 개
      </Text>
    </div>
  )
}
