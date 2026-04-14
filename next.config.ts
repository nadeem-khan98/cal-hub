import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://0.0.0.0:3000",
    "http://localhost:3000",
    "192.168.1.35",
    "cascade-riding-distaste.ngrok-free.dev",
  ],
};

export default nextConfig;

