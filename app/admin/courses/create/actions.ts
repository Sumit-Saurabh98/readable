"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

// arcjet

const aj = arcjet.withRule(
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

    const thumbnailUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${encodeURIComponent(validation.data.fileKey)}`

    const productData = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.smallDescription,
      images: [thumbnailUrl],
      default_price_data: {
        currency: 'usd',
        unit_amount: validation.data.price * 100
      }
    })

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
        stripePriceId: productData.default_price as string
      },
    });
    

    return {
      status: "success",
      message: "Course created successfully"
    };
  } catch {
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}
