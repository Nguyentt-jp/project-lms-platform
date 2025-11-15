"use server"

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/prisma";
import { ApiResponse, CourseSchemaType } from "@/lib/type";
import { courseSchema } from "@/lib/zodSchemas";
import request from "@/lib/arcjet";

const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: [],
    })
).withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5
    })
)

export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse> {
        const session = await requireAdmin();
    try {
        // @ts-ignore
        const req = await request();
        const decision = await aj.protect(req,{
            fingerprint: session.user.id
        });

        if (decision.isDenied()){
            if (decision.reason.isRateLimit()){
                return {
                    status: 'Error',
                    message: "You have been blocked due to rate limiting!"
                }
            } else {
                return {
                    status: "Error",
                    message: "You are a bot! if this is a mistake contact our support"
                }
            }
        }

        const validation = courseSchema.safeParse(values)

        if (!validation.success) {
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