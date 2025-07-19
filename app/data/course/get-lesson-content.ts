import "server-only"
import { requireUser } from "../user/require-user"
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getLessonContent(lessonId: string){
    const session = await requireUser();

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
        },
        select: {
            id: true,
            title: true,
            position: true,
            videoKey: true,
            thumbnailKey: true,
            description: true,
            lessonProgress: {
                where: {
                    userId: session.id
                },
                select: {
                    completed: true,
                    lessonId: true
                }
            },
            Chapter: {
                select: {
                    courseId: true,
                    Course: {
                        select: {
                            slug: true
                        }
                    }
                }
            }
        }
    })

    if(!lesson){
        return notFound();
    }

    const enrollment = await prisma.enrollment.findFirst({
        where: {
            userId: session.id,
            courseId: lesson.Chapter.courseId
        },
        select: {
            status: true
        }
    })

    if(!enrollment || enrollment.status !== "Active"){
        return notFound();
    }

    return lesson
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>