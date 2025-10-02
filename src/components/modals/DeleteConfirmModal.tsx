import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm?: () => void;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete the record.",
  onConfirm,
}: DeleteConfirmModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      toast.success("Record deleted successfully");
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[90%] max-w-sm sm:max-w-md md:max-w-lg rounded-xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold sm:text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground sm:text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row items-center justify-end gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
