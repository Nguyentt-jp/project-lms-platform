"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse, CourseSchemaType } from "@/lib/type";
import { courseSchema } from "@/lib/zodSchemas";
import { prisma } from "@/lib/prisma";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

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

export async function updateCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    const user = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req,{
            fingerprint: user.user.id
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

        const result = courseSchema.safeParse(data);

        if(!result){
            return {
                status: "Error",
                message: "Data invalid",
            };
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id,
            },
            data: {
                ...result.data
            },
        });

        return {
            status: "Success",
            message: "Course updated successfully!",
        }
    } catch {
        return {
            status: "Error",
            message: "Failed to update Course.",
        }
    }
}