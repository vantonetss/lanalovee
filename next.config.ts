import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the cloud preview gateway origin to access the dev server assets
  allowedDevOrigins: ["*.space-z.ai"],
};

export default nextConfig;
