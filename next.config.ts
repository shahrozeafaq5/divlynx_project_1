import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "googleusercontent.com" },
      { protocol: "https", hostname: "googleusercontent.com" },

      { protocol: "https", hostname: "i0.wp.com" },
    ],
  },
};

export default nextConfig;