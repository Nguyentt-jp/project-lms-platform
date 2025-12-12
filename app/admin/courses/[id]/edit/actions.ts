"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse, CourseSchemaType } from "@/lib/type";
import { courseSchema } from "@/lib/zodSchemas";
import { prisma } from "@/lib/prisma";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { CourseLevel, CourseStatus } from "@/lib/generated/prisma/enums";
import { revalidatePath } from "next/cache";

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
                ...result.data,
                level: result.data?.level as CourseLevel,
                status: result.data?.status as CourseStatus,
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

export async function reorderLessons(chapterId: string, lesson: {id: string, position: number}[], courseId: string): Promise<ApiResponse> {
    await requireAdmin();
    try {
        if(!lesson || lesson.length === 0) {
            return {
                status: "Error",
                message: "No lessons provided for reordering.",
            };
        }

        const updates = lesson.map((lesson) => prisma.lesson.update({
            where: {
                id: lesson.id,
                chapterId: chapterId,
            },
            data: {
                position: lesson.position,
            }
        }));

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "Success",
            message: "Lessons reordered successfully!",
        }

    } catch(error) {
        return {
            status: "Error",
            message: "Failed to reorder lessons.",
        };
    }
}

export async function reorderChapter(chapterId: string, chapters: {id: string, position: number}[]): Promise<ApiResponse> {
    await requireAdmin();
    try {
        if(!chapters || chapters.length === 0) {
            return {
                status: "Error",
                message: "No chapters provided for reordering.",
            }
        }

        const updates = chapters.map((chapter) => prisma.chapter.update({
            where: {
                id: chapter.id,
                courseId: chapterId,
            },
            data: {
                position: chapter.position,
            },
        }));

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${chapterId}/edit`);

        return {
            status: "Success",
            message: "Lessons reordered successfully!",
        }
    } catch(error) {
        return {
            status: "Error",
            message: "Failed to reorder chapters.",
        };
    }
}