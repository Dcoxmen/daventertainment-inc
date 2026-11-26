import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Conversational Analytics Engine was renamed on 2026-11-26.
      {
        source: "/work/conversational-analytics",
        destination: "/work/data-analytics-dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
