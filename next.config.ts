import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lbowahtxqsglljuqbfup.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/notre-histoire",
        destination: "/qui-sommes-nous#histoire",
        permanent: true,
      },
      {
        source: "/nos-engagements",
        destination: "/qui-sommes-nous#engagements",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
