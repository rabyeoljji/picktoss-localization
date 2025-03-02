import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { Text } from "@/shared/components/ui/text";

function App() {
  return (
    <div>
      <Text typo="h1">App</Text>
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a description for the dialog.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>Your dialog content goes here.</p>
          </div>
          <DialogFooter>
            <DialogClose>Close Dialog</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
