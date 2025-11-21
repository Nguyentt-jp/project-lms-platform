import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";

export async function adminGetCourses(){
    await requireAdmin();

    return prisma.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
        },
    });
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];