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
  ],
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      { source: "/logo.png", destination: "/icon.svg" },
      { source: "/dashboard/logo.png", destination: "/icon.svg" },
    ];
  },
};

export default nextConfig;
