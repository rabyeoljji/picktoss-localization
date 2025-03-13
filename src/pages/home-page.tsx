import { withHOC } from "@/app/hoc/with-page-config"
import { Button } from "@/shared/components/ui/button"
import { Text } from "@/shared/components/ui/text"

const HomePage = () => {
  return (
    <div className="flex flex-col gap-6 px-10">
      <Text typo="h1">어떤 걸 만들어볼까요?</Text>
      <Button variant="secondary1">호에에엥</Button>
      <Button variant="secondary2">호에에엥</Button>
      <Button variant="tertiary">호에에엥</Button>
      <div className="size-8">alsjdlas</div>
    </div>
  )
}

export default withHOC(HomePage, {
  activeTab: "홈",
})
