import "server-only";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function adminGetCourse(id: string) {
    await requireAdmin();

    const data = await prisma.course.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            smallDescription: true,
            fileKey: true,
            price: true,
            duration: true,
            level: true,
            status: true,
            slug: true,
            category: true,
            chapters: {
                select: {
                    id: true,
                    position: true,
                    title: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailUrl: true,
                            videoUrl: true,
                            position: true
                        }
                    }
                }
            }
        },
    })

    if (!data){
        return notFound();
    }

    return data;
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>;