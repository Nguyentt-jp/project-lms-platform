import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";
import { z } from "zod";

export const fileUploadSchema = z.object({
    fileName: z.string().min(
        1,
        "Filename is required!"
    ),
    contentType: z.string().min(
        1,
        "Content type is required!"
    ),
    size: z.number().min(
        1,
        "Size is required!",
    ),
    isImage: z.boolean(),
});

const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: [],
    })
).withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5
    })
)

export async function POST(request: Request) {

    const session = await requireAdmin();

    try {
        const decision = await aj.protect(request, {
            fingerprint: session.user.id
        });

        if (decision.isDenied()) {
            return NextResponse.json(
                { message: "To many request!" },
                { status: 429 }
            );
        }

        const body = await request.json();

        const fileValid = fileUploadSchema.safeParse(body);

        if (!fileValid.success) {
            return NextResponse.json(
                { error: "Invalid Request Body" },
                { status: 400 }
            );
        }

        const { fileName, contentType, size } = fileValid.data;

        const unique = `${uuid4()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_STORAGE_BUCKET,
            ContentType: contentType,
            ContentLength: size,
            Key: unique,
        });

        const preSignerURL = await getSignedUrl(s3Client, command, {
            expiresIn: 360, // URL expires in 6 minutes
        });

        const response = { preSignerURL, key: unique }

        return NextResponse.json(response);
    } catch {
        return NextResponse.json(
            { error: "Failed to generate presigned URL" },
            { status: 500 }
        )
    }
}