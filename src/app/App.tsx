import { SystemDialog } from "@/shared/components/system-dialog";

function App() {
  return (
    <div>
      <SystemDialog
        trigger={<button>Open Dialog</button>}
        title="타이틀"
        content={<input className="border border-gray-400" />}
        onConfirm={() => {}}
      />
    </div>
  );
}

export default App;
