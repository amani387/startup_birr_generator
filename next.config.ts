import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
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
