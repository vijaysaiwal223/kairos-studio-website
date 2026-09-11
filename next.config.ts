import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only serves allowlisted qualities. The loading reel intentionally
    // uses 60; without this entry Next silently rounds it back to 75.
    qualities: [60, 75],
  },
};

export default nextConfig;
