"use server"

import { ApiResponse, CourseSchemaType, User } from "@/lib/type";
import { courseSchema } from "@/lib/zodSchemas";
import { prisma } from "@/lib/prisma";
import { useAuth } from "@/context/auth-provider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse> {
    try {
        const validation = courseSchema.safeParse(values)

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if(!session){
            redirect("/login")
        }

        if ( !validation.success ){
            return {
                status: "Error",
                message: "Invalid form data"
            }
        }

        await prisma.course.create({
            data: {
                ...validation.data,
                userId: session.user.id as string
            },
        })

        return {
            status: "Success",
            message: "Course created successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            status: "Error",
            message: "Failed to create course"
        }
    }
}