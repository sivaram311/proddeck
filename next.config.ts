import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Access-Control-Allow-Origin", value: "*" },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Authorization, Content-Type, Accept, X-Requested-With, X-API-Key",
        },
      ],
    },
  ],
};

export default nextConfig;
