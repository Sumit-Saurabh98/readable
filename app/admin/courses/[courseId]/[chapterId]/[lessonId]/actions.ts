"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

export async function updateLesson(values: LessonSchemaType, lessonId: string): Promise<ApiResponse> {
    await requireAdmin();

    try {

        const result = lessonSchema.safeParse(values);

        if(!result.success){
            return {
                status:"error",
                message:"Invalid Data"
            }
        }

        await prisma.lesson.update({
            where: {
                id: lessonId
            },
            data: {
                title: result.data.name,
                description: result.data.description,
                videoKey: result.data.videoKey,
                thumbnailKey: result.data.thumbnailKey
            }
        });

        return {
            status:"success",
            message:"Lesson updated successfully"
        }
        
    } catch {
        return {
            status:"error",
            message:"An unexpected error occured. Please try again"
        }
    }
}