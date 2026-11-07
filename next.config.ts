import type { NextConfig } from "next";

/**
 * Admin console: every page is per-admin and per-request (behind sign-in), so Cache Components
 * and partial prefetching (built for public static shells) are left off. Pages render
 * dynamically and stream with loading.tsx.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

export default nextConfig;
