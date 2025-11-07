import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

export const s3Client = new S3Client({
    region: env.S3_STORAGE_REGION,
    endpoint: env.S3_STORAGE_URL,
    credentials: {
        accessKeyId: env.S3_STORAGE_ACCESS_KEY,
        secretAccessKey: env.S3_STORAGE_SECRET_KEY,
    },
    forcePathStyle: false,
});