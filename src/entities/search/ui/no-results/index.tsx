import { Text } from '@/shared/components/ui/text'

export const NoResults = () => (
  <div className="center text-center">
    <Text typo="subtitle-1-bold" color="primary">
      검색 결과가 없어요
    </Text>
    <Text typo="body-1-medium" color="sub" className="mt-1">
      다른 키워드를 입력해보세요
    </Text>
  </div>
)
