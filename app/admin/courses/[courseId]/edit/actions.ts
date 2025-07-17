"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

// arcjet

const aj = arcjet.withRule(
    detectBot({
      mode: "LIVE",
      allow: []
    })
  ).withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5
    })
  )

export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse>{
    const user = await requireAdmin();

    try {

        const req = await request();

        const decision = await aj.protect(req,{
          fingerprint: user?.user.id as string
        });
    
        if (decision.isDenied()) {
          if(decision.reason.isRateLimit()){
            return {
              status: "error",
              message: "You have reached the rate limit. Please try again later",
            };
          }else{
            return {
              status: "error",
              message: "Dude, you seem to be a bot",
            };
          }
        }

        const result = courseSchema.safeParse(data);

        if(!result.success){
            return {
                status: "error",
                message: "Invalid Data"
            }
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id
            },
            data: {
                ...result.data
            }
        })

        return {
            status: "success",
            message: "Course Updated Successfully"
        }
        
    } catch (error) {
        return {
            status: "error",
            message: "Failed to update course. Please try again"
        }
    }
}

export async function reorderLessons(
  chapterId: string, 
  lessons: { id: string, position: number }[],
  courseId: string
): Promise<ApiResponse>{
  await requireAdmin();
  try {
    
    if(!lessons || lessons.length === 0){
      return {
        status: "error",
        message: "No lessons to reorder"
      }
    }

    const updates = lessons.map((lesson)=>prisma.lesson.update({
      where: {
        id: lesson.id,
        chapterId: chapterId
      },
      data: {
        position: lesson.position
      }
    }))

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons Reordered Successfully"
    }

  } catch (error) {
    return {
      status: "error",
      message: "Failed to reorder lesson"
    }
  }
}

// ... existing code ...
export async function reorderChapters(
  courseId:string, 
  chapters: {id: string, position:number}[]
): Promise<ApiResponse> {
  await requireAdmin();
  try {

    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters to reorder"
      }
    }

    const updates = chapters.map((chapter) => prisma.chapter.update({
      where: {
        id: chapter.id,
        courseId: courseId
      },
      data: {
        position: chapter.position
      }
    }))

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters Reordered Successfully"
    }

  } catch (error) {
    return {
      status: "error",
      message: "Failed to reorder chapters"
    }
  }
}

export async function createChapter(values: ChapterSchemaType): Promise<ApiResponse> {
  await requireAdmin();
  try {
    
    const result = chapterSchema.safeParse(values);

    if(!result.success){
      return {
        status: "error",
        message: "Invalid Data"
      }
    }

    await prisma.$transaction(async (tx)=> {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId
        },
        select: {
          position: true
        },
        orderBy: {
          position: "desc"
        }
      })

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        }
      })
    })

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

    return {
      status: "success",
      message: "Chapter created successfully"
    }


  } catch (error) {
    return {
      status: "error",
      message: "Failed to create chapter"
    }
  }
}

export async function createLesson(values: LessonSchemaType): Promise<ApiResponse> {
  await requireAdmin();
  try {
    
    const result = lessonSchema.safeParse(values);

    console.log(result, "->>>>>>>result")

    if(!result.success){
      return {
        status: "error",
        message: "Invalid Data"
      }
    }

    await prisma.$transaction(async (tx)=> {
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId
        },
        select: {
          position: true
        },
        orderBy: {
          position: "desc"
        }
      })

      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailKey,
          chapterId: result.data.chapterId,
          position: (maxPos?.position ?? 0) + 1,
        }
      })
    })

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

    return {
      status: "success",
      message: "Lesson created successfully"
    }


  } catch (error) {
    return {
      status: "error",
      message: "Failed to create lesson"
    }
  }
}

export async function deleteLesson(
  {chapterId,
    courseId,
    lessonId}:{
      chapterId: string,
      courseId: string,
      lessonId: string
    }
): Promise<ApiResponse>{
  await requireAdmin();
  try {

    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id: chapterId
      },
      select: {
        lessons: {
          orderBy: {
            position: "asc"
          },
          select: {
            id: true,
            position: true
          }
        }
      }
    })

    if(!chapterWithLessons){
      return {
        status: "error",
        message: "Chapter not found"
      }
    }

    const lessons = chapterWithLessons.lessons;

    if(!lessons){
      return {
        status: "error",
        message: "Lessons not found"
      }
    }

    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);

    if(!lessonToDelete){
      return {
        status: "error",
        message: "Lesson not found"
      }
    }


    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = remainingLessons.map((lesson, index) => prisma.lesson.update({
      where: {
        id: lesson.id
      },
      data: {
        position: index + 1
      }
    }))

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: {
          id: lessonId,
          chapterId: chapterId
        }
      })
    ])

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      status: "success",
      message: "Lesson deleted successfully"
    }
    
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete lesson"
    }
  }
}

export async function deleteChapter(
  {chapterId,
    courseId}:{
      chapterId: string,
      courseId: string
    }
): Promise<ApiResponse>{
  await requireAdmin();
  try {

    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id: courseId
      },
      select: {
        chapter: {
          orderBy: {
            position: "asc"
          },
          select: {
            id: true,
            position: true
          }
        }
      }
    })

    if(!courseWithChapters){
      return {
        status: "error",
        message: "Course not found"
      }
    }

    const chapters = courseWithChapters.chapter;

    if(!chapters){
      return {
        status: "error",
        message: "Chapter not found"
      }
    }

    const chapterToDelete = chapters.find((chapter) => chapter.id === chapterId);

    if(!chapterToDelete){
      return {
        status: "error",
        message: "Chapter not found"
      }
    }

    const remainingChapters = chapters.filter((chapter) => chapter.id !== chapterId);

    const updates = remainingChapters.map((chapter, index) => prisma.chapter.update({
      where: {
        id: chapter.id
      },
      data: {
        position: index + 1
      }
    }))

    console.log(updates, "console -> 01")

    await prisma.$transaction([
      // First delete all lessons in the chapter
      prisma.lesson.deleteMany({
        where: {
          chapterId: chapterId
        }
      }),
      // Then delete the chapter
      prisma.chapter.delete({
        where: {
          id: chapterId,
        }
      }),
      // Finally update positions of remaining chapters
      ...updates
    ])

    console.log("Transaction completed successfully", "console -> 02")

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      status: "success",
      message: "Chapter deleted successfully"
    }
    
  } catch (error) {
    console.error("Delete chapter error:", error)
    return {
      status: "error",
      message: "Failed to delete chapter in the course."
    }
  }
}