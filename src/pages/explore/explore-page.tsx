import { withHOC } from '@/app/hoc/with-page-config'

const ExplorePage = () => {
  return <div>explore</div>
}

export default withHOC(ExplorePage, {
  activeTab: '탐험',
  backgroundColor: 'bg-blue-100',
})
