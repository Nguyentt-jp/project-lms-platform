import { useState, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { createChapter } from "@/app/admin/courses/[id]/edit/actions";
import { toast } from "sonner";

export default function NewChapterModal({courseId}: {courseId: string}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ChapterSchemaType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: "",
            courseId
        }
    });

    function onSubmit(values: ChapterSchemaType) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(createChapter(values))
            
            if(error) {
                toast.error("An unexpected error occurred. Please try again.");
                return;
            }
            
            if(result.message === "success") {
                toast.success(result.message);
                form.reset();
                setIsOpen(false);
            } else if(result.status === "Error") {
                toast.error(result.message);
            }
        });
    }

    function handleOpenChange(open: boolean) {
        if (!open){
            form.reset();
        }
        setIsOpen(open);
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2" variant="outline" size="sm">
                    <Plus className="size-4"/> New Chapter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create new chapter</DialogTitle>
                    <DialogDescription>
                        What would you like to name the new chapter?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Chapter Name " {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={isPending} type="submit">
                                { isPending ? "Saving..." : "Save Change"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}