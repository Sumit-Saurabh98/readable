import "server-only"
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug: string){
    const session = await requireUser();

    const course = await prisma.course.findUnique({
        where: {
            slug: slug
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
            category: true,
            chapter: {
                orderBy: {
                    position: "asc"
                },
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        orderBy: {
                            position: "asc"
                        },
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailKey: true,
                            videoKey: true,
                            position: true,
                            lessonProgress: {
                                where: {
                                    userId: session.id
                                },
                                select: {
                                    completed: true,
                                    lessonId: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if(!course){
        return notFound();
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.id,
                courseId: course.id
            }
        }
    })

    if(!enrollment || enrollment.status !== "Active"){
        return notFound();
    }

    return {
        course
    }
}

export type CourseSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarData>>