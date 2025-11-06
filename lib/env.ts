import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        BETTER_AUTH_URL: z.url(),
        BETTER_AUTH_SECRET: z.string().min(1),
        DATABASE_URL: z.url(),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        RESEND_API_KEY: z.string().min(1),
        ARCJET_KEY: z.string().min(1),
        S3_STORAGE_URL: z.url(),
        S3_STORAGE_REGION: z.string().min(1),
        S3_STORAGE_ACCESS_KEY: z.string().min(1),
        S3_STORAGE_SECRET_KEY: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_S3_STORAGE_BUCKET: z.string().min(1)
    },
    // For Next.js >= 13.4.4, you only need to destructure client variables:
    experimental__runtimeEnv: {
        NEXT_PUBLIC_S3_STORAGE_BUCKET: process.env.NEXT_PUBLIC_S3_STORAGE_BUCKET,
    }
});