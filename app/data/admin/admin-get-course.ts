import "server-only"
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetCourse(id:string){
    await requireAdmin();

    const data = await prisma.course.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            description: true,
            duration:true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
            category: true
        }
    })

    if(!data){
        return notFound();
    }

    return data;
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>