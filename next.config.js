const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "picsum.photos",
      "assets.ajio.com",
      "rukminim2.flixcart.com",
      "m.media-amazon.com",
    ],
  },
  webpack: (config, { nextRuntime }) => {
    // Undocumented property of next 12.
    if (nextRuntime !== "nodejs") return config;
    return {
      ...config,
      entry() {
        return config.entry().then((entry) => ({
          ...entry,
        }));
      },
    };
  },
};

module.exports = nextConfig;
