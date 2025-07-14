"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

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



export async function CreateCourse(data: CourseSchemaType):Promise<ApiResponse>  {

  const session  = await requireAdmin();

  try {

    const req = await request();

    const decision = await aj.protect(req,{
      fingerprint: session?.user.id as string
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

    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid request body",
      };
    }

    const course = await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    });
    

    return {
      status: "success",
      message: "Course created successfully"
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}
