import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";


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

export async function DELETE(request: NextRequest) {

  const session = await requireAdmin()

  try {

   

    const decision = await aj.protect(request,{
      fingerprint: session?.user.id as string
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Dude, you seem to be a bot" },
        { status: 429 }
      );
    }

    const body = await request.json();

    const key = body.key;

    if (!key) {
      return NextResponse.json(
        { error: "Missing or Invalid request body" },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json({message: "File deleted successfully"}, {status: 200});
  } catch (error) {
    return NextResponse.json(
        { error: "Missing or Invalid request body" },
        { status: 500 }
      );
  }
}
