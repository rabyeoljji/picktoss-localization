import { withHOC } from "@/app/hoc/with-page-config"

const NotesPage = () => {
  return <div>Notes</div>
}

export default withHOC(NotesPage, {
  activeTab: "퀴즈노트",
})
