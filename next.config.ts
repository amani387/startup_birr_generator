import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Allow LAN/mobile testing in dev (fixes blocked HMR + blank client UI)
  allowedDevOrigins: [
    "172.25.224.1",
    "localhost",
    "127.0.0.1",
    "213.254.179.94",
    "gogenzeb.com",
    "www.gogenzeb.com",
  ],
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/icon" },
      { source: "/logo.png", destination: "/logo.svg" },
      { source: "/dashboard/logo.png", destination: "/logo.svg" },
    ];
  },
};

export default nextConfig;
