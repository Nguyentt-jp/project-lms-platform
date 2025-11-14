import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";
import { s3Client } from "@/lib/s3Client";

export async function DELETE( request: Request ) {
    try {
        const body = await request.json();

        console.log(body)

        const key = body.Key;

        console.log(key)

        if ( !key ) {
            return NextResponse.json(
                { error: "Missing or invalid object key" },
                { status: 400 }
            );
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_STORAGE_BUCKET,
            Key: key
        });

        await s3Client.send(command);

        return NextResponse.json(
            { message: "File deleted successfully"},
            { status: 200 }
        );

    } catch {
        return NextResponse.json(
            { error: "Ser" },
            { status: 500 }
        );
    }
}