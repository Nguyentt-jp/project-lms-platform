import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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

            if(result.status === "Success") {
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
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure!</AlertDialogTitle>
                    <AlertDialogDescription>This active cannot be undone. This will permanently delete this chapter.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={onSubmit} disabled={isPending}>
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}