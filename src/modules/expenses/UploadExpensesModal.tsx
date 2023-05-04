import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '../ui';

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
