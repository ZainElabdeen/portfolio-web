import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  //   DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
interface FormDialogProps {
  childreen: ReactNode;
  open: boolean;
  header: string;
}

const FormDialog = ({ childreen, open, header }: FormDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">{childreen}</div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
