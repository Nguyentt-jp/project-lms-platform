import { AlertDialog, AlertDialogCancel, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteChapter } from "@/app/admin/courses/[id]/edit/actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

export default function DeleteChapter({chapterId, courseId}: {chapterId: string, courseId: string}) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function onSubmit() {
        startTransition(async () => {
           const {data: result, error} = await tryCatch(deleteChapter({chapterId, courseId}));

            if(error) {
                toast.error("An unexpected error occurred. Please try again.");
                return;
            }

            if(result.message === "success") {
                toast.success(result.message);
                setOpen(false);
            } else if(result.status === "Error") {
                toast.error(result.message);
            }
        });
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="size-4"/>
                </Button>
            </AlertDialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure!</DialogTitle>
                    <DialogDescription>This active cannot be undone. This will permanently delete this chapter.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={onSubmit} disabled={open}>
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </AlertDialog>
    )
}