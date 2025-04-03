import { withHOC } from '@/app/hoc/with-page-config'

const CollectionsPage = () => {
  return <div>collections</div>
}

export default withHOC(CollectionsPage, {
  activeTab: '컬렉션',
  backgroundColor: 'bg-blue-100',
})
