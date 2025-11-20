"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Loader2, SparkleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/rich-text-editor/editor";
import Uploader from "@/components/file-upload/uploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courseCategories, courseLevel, courseSchema, courseStatus } from "@/lib/zodSchemas";
import { IconPlus } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { CourseSchemaType } from "@/lib/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateCourse } from "@/app/admin/courses/[id]/edit/actions";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";

interface IAppProps {
    data: AdminCourseSingularType;
}

export default function EditCourseForm({data}: IAppProps) {
    const [ isPending, startTransition ] = useTransition();

    const router = useRouter();

    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: data.title,
            description: data.description,
            fileKey: data.fileKey,
            price: data.price,
            duration: data.duration,
            level: data.level,
            category: data.category,
            smallDescription: data.smallDescription,
            slug: data.slug,
            status: data.status,
        }
    });

    function onSubmit(values: CourseSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(updateCourse(values, data.id));

            if ( error ) {
                toast.error("An unexpected error occurred. Please try again.");
                return;
            }

            if ( result.status === "Success" ) {
                toast.success(result.message);
                form.reset();
                router.push("/admin/courses")
            } else {
                toast.error(result.message)
            }
        });
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-4 items-end">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="Slug" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="button"
                        className="w-fit"
                        onClick={() => {
                            const titleValue = form.getValues("title")
                            const slug = slugify(titleValue);
                            form.setValue("slug", slug, { shouldValidate: true });
                        }}
                    >
                        Generate Slug
                        <SparkleIcon className="ml-1" size={16}/>
                    </Button>
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="smallDescription"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Small Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Description"
                                        className="min-h-[120px]"
                                        {...field}
                                    />

                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <RichTextEditor field={field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="fileKey"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Thumnail Image</FormLabel>
                                <FormControl>
                                    <Uploader onChange={field.onChange} value={field.value}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseCategories.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Level</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Level"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseLevel.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder=""
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Duration (hour)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder=""
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Status"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseStatus.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                Updating...
                                <Loader2 className="animate-spin ml-1"/>
                            </>
                        ) : (
                            <>
                                Update Course
                                <IconPlus className="ml-1" size={16}/>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}