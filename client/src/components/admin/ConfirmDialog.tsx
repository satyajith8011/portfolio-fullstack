import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface ConfirmDialogProps {
  title: string;
  description: string;
  trigger?: ReactNode;
  onConfirm: () => void;
  isPending?: boolean;
  variant?: "destructive" | "default";
  triggerLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  title,
  description,
  trigger,
  onConfirm,
  isPending = false,
  variant = "destructive",
  triggerLabel = "Delete",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) {
  const buttonVariant = variant === "destructive" ? "destructive" : "default";
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant={buttonVariant} size="sm" disabled={isPending}>
            {variant === "destructive" && <Trash2 className="mr-2 h-4 w-4" />}
            {isPending ? "Please wait..." : triggerLabel}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={variant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}