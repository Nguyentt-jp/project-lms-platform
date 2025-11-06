import { z } from "zod";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";
import { v4 as uuid4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3Client";

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

export async function POST( request: Request ) {
    try {
        const body = await request.json();

        const fileValid = fileUploadSchema.safeParse(body);

        if ( !fileValid.success ) {
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