"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { ArrowLeft, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { courseSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseSchemaType } from "@/lib/type";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function CourseCreationPage(){
    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "", 
            description: "", 
            fileKey: "", 
            price: 0, 
            duration: 0, 
            level: "Beginner", 
            category: "", 
            smallDescription: "", 
            slug: "", 
            status: "Draft", 
        } 
    });

    function onSubmit(data: CourseSchemaType) {
        // Do something with the form values.
        console.log(data)
    }
    return(
        <>
            <div className="flex items-center gap-4">
                <Link href="/admin/course">
                    <ArrowLeft className={buttonVariants({
                        variant: "outline",
                        size: "icon"
                    })}/>
                </Link>
                <h1 className="text-2xl font-bold">Create Course</h1>
            </div>
            <Card>
                <CardHeader>
                    Basic Information.
                    <CardDescription>
                        Provide basic information about the course
                    </CardDescription>
                </CardHeader>                
                <CardContent>
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
                                            <Input placeholder="Title" {...field}/>
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
                                            <Input placeholder="Slug" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                                <Button>
                                    Generate Slug
                                    <SparkleIcon className="ml-1" size={8}/>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}