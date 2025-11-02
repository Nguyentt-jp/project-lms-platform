"use client"

import RichTextEditor from "@/components/rich-text-editor/editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CourseSchemaType } from "@/lib/type";
import { courseCategoris, courseLevel, courseSchema, courseStatus } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { ArrowLeft, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import slugify from "slugify";

export default function CourseCreationPage() {
	const form = useForm<CourseSchemaType>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			title: "",
			description: "",
			fileKey: "",
			price: 0,
			duration: 0,
			level: "Beginner",
			category: "Music",
			smallDescription: "",
			slug: "",
			status: "Draft",
		}
	});

	function onSubmit(data: CourseSchemaType) {
		// Do something with the form values.
		console.log(data)
	}
	return (
		<>
			<div className="flex items-center gap-4">
				<Link href="/admin/course">
					<ArrowLeft className={buttonVariants({
						variant: "outline",
						size: "icon"
					})} />
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
												<Input placeholder="Title" {...field} />
											</FormControl>
											<FormMessage />
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
											<FormMessage />
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
									<SparkleIcon className="ml-1" size={16} />
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
												{/* <Textarea
													placeholder="Small Description"
													className="min-h-[120px]"
													{...field}
												/> */}
												<RichTextEditor field={field}/>
											</FormControl>
											<FormMessage />
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
												<Textarea
													placeholder="Description"
													className="min-h-[120px]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
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
												<Input placeholder="Thumnail url" {...field} />
											</FormControl>
											<FormMessage />
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
															<SelectValue placeholder="Select Category" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{courseCategoris.map((item) => (
															<SelectItem key={item} value={item}>
																{item}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
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
															<SelectValue placeholder="Select Level" />
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
											<FormMessage />
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
											<FormMessage />
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
											<FormMessage />
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
															<SelectValue placeholder="Status" />
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
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div>
								<Button>
									Create Course
									<IconPlus className="ml-1" size={16} />
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</>
	);
}