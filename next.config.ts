import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [ new URL("https://lms-storage.t3.storage.dev/**")]
    },
};

export default nextConfig;
