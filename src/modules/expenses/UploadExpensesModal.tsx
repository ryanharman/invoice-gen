import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DialogHeader, DialogFooter } from "~/components/ui/dialog";

export function UploadExpensesModal() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload expenses</DialogTitle>
        <DialogDescription>
          Select your CSV file to upload and we&apos;ll do the rest. If you
          upload a file that&apos;s already been uploaded, we&apos;ll ignore
          entries that already exist in our system.
        </DialogDescription>
      </DialogHeader>
      <Input type="file" />
      <DialogFooter>
        <Button type="submit">Upload</Button>
      </DialogFooter>
    </DialogContent>
  );
}
