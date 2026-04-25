import type { NextConfig } from "next";

const backendBaseUrl =
  process.env.BACKEND_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendBaseUrl.replace(/\/$/, "")}/api/:path*`
      },
    ];
  }
};

export default nextConfig;
