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

interface ConfirmLogoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmLogout({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmLogoutProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-md w-[90vw] sm:w-full p-6 sm:p-6">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-center sm:text-left">
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
            Are you sure you want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-3 sm:gap-2 mt-6 sm:flex-col w-full">
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-full order-1"
          >
            LOGOUT
          </AlertDialogAction>
          <AlertDialogCancel className="w-full border-0 text-red-600 hover:text-red-700 hover:bg-transparent font-semibold py-4 sm:py-6 text-sm sm:text-base mt-0 order-2">
            CANCEL
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
