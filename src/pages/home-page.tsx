import { withHOC } from '@/app/hoc/with-page-config'

import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'
import { SearchInput } from '@/shared/components/ui/search-input'

const HomePage = () => {
  return (
    <div className="flex flex-col gap-6 px-10 h-[200vh] scrollbar-hide">
      <SearchInput />
      <Drawer>
        <DrawerTrigger asChild>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
        </DrawerTrigger>

        <DrawerContent height="full">
          <DrawerHeader>
            <DrawerTitle>다른 폴더로 이동</DrawerTitle>
            <DrawerDescription>노트를 이동시킬 폴더를 선택해주세요.</DrawerDescription>
          </DrawerHeader>

          <DrawerBody>
            <div>
              <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
              <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
            </div>
          </DrawerBody>

          <DrawerFooter>
            <DrawerClose asChild>
              <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
        </DrawerTrigger>

        <DrawerContent height="lg">
          <DrawerHeader>
            <DrawerTitle>다른 폴더로 이동</DrawerTitle>
            <DrawerDescription>노트를 이동시킬 폴더를 선택해주세요.</DrawerDescription>
          </DrawerHeader>

          <DrawerBody>
            <div>
              <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
              <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
            </div>
          </DrawerBody>

          <DrawerFooter>
            <DrawerClose asChild>
              <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
        </DrawerTrigger>

        <DrawerContent height="md">
          <DrawerHeader>
            <DrawerTitle>다른 폴더로 이동</DrawerTitle>
            <DrawerDescription>노트를 이동시킬 폴더를 선택해주세요.</DrawerDescription>
          </DrawerHeader>

          <DrawerBody>
            <div>
              <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
              <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
            </div>
          </DrawerBody>

          <DrawerFooter>
            <DrawerClose asChild>
              <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
        </DrawerTrigger>

        <DrawerContent height="sm">
          <DrawerFooter>
            <DrawerClose asChild>
              <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default withHOC(HomePage, {
  activeTab: '홈',
})
