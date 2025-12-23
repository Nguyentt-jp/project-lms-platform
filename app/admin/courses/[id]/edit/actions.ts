"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse} from "@/lib/type";
import {
    chapterSchema,
    ChapterSchemaType,
    courseSchema,
    CourseSchemaType,
    lessonSchema,
    LessonSchemaType
} from "@/lib/zodSchemas";
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

export async function createChapter(values: ChapterSchemaType): Promise<ApiResponse> {
    await requireAdmin();
    try {
        const result = chapterSchema.safeParse(values);
        
        if(!result.success) {
            return {
                status: "Error",
                message: "Invalid Data."
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.chapter.findFirst({
                where: {
                    courseId: result.data.courseId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc"
                }
            });
            await tx.chapter.create({
                data: {
                    title: result.data.name,
                    courseId: result.data.courseId,
                    position: (maxPos?.position ?? 0) + 1,
                }
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

        return {
            status: "Success",
            message: "create chapter successfully!",
        }
    } catch(error) {
        return {
            status: "Error",
            message: "Failed to create chapter.",
        };
    }
}

export async function createLesson(values: LessonSchemaType): Promise<ApiResponse> {
    await requireAdmin();
    try {
        const result = lessonSchema.safeParse(values);

        if(!result.success) {
            return {
                status: "Error",
                message: "Invalid Data."
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.lesson.findFirst({
                where: {
                    chapterId: result.data.chapterId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc"
                }
            });
            await tx.lesson.create({
                data: {
                    title: result.data.name,
                    description: result.data.description,
                    videoUrl: result.data.videoUrl,
                    thumbnailUrl: result.data.thumbnailUrl,
                    chapterId: result.data.chapterId,
                    position: (maxPos?.position ?? 0) + 1,
                }
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

        return {
            status: "Success",
            message: "create lesson successfully!",
        }
    } catch(error) {
        return {
            status: "Error",
            message: "Failed to create lesson.",
        };
    }
}

export async function deleteLesson({chapterId, courseId, lessonId}: {chapterId: string, courseId: string, lessonId: string}): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const chapterWithLessons = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
            },
            select: {
                lessons: {
                    orderBy: {
                        position: "asc",
                    },
                    select: {
                        id: true,
                        position: true,
                    },
                },
            },
        });

        if(!chapterWithLessons) {
            return {
                status: "Error",
                message: "Chapter not found.",
            }
        }

        const lessonToDelete = chapterWithLessons.lessons.find(
            (lesson) => lesson.id === lessonId
        );
        
        if(!lessonToDelete) {
            return {
                status: "Error",
                message: "Lesson not found in the chapter.",
            }
        }

        const remainingLessons = chapterWithLessons.lessons.filter(
            (lesson) => lesson.id !== lessonId
        );

        const updates = remainingLessons.map(
            (lesson, index) => {
                return prisma.lesson.update({
                    where: {
                        id: lesson.id,
                    },
                    data: {
                        position: index + 1,
                    }
                });
            }
        );

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
               where: {
                   id: lessonId,
                   chapterId: chapterId,
               },
            }),
        ]);

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "Success",
            message: "Delete lesson successfully!",
        }
    } catch(error) {
        return {
            status: "Error",
            message: "Failed to delete lesson.",
        };
    }
}

export async function deleteChapter({chapterId, courseId}: {chapterId: string, courseId: string}): Promise<ApiResponse> {
    await requireAdmin();
    try {
        const courseWithChapters = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                chapters: {
                    orderBy: {
                        position: "asc",
                    },
                    select: {
                        id: true,
                        position: true,
                    },
                },
            },
        });

        if(!courseWithChapters) {
            return {
                status: "Error",
                message: "Course not found.",
            }
        }

        const chapterToDelete = courseWithChapters.chapters.find(
            (chapter) => chapter.id === chapterId
        );

        if(!chapterToDelete) {
            return {
                status: "Error",
                message: "Lesson not found in the chapter.",
            }
        }

        const remainingChapters = courseWithChapters.chapters.filter(
            (chapter) => chapter.id !== chapterId
        );

        const updates = remainingChapters.map(
            (chapter, index) => {
                return prisma.chapter.update({
                    where: {
                        id: chapter.id,
                    },
                    data: {
                        position: index + 1,
                    }
                });
            }
        );

        await prisma.$transaction([
            ...updates,
            prisma.chapter.delete({
                where: {
                    id: chapterId,
                },
            }),
        ]);

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "Success",
            message: "Delete chapter and positions reordered successfully!",
        }
    } catch(error) {
        return {
            status: "Error",
            message: "Failed to delete chapter.",
        };
    }
}