/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

module.exports = nextConfig;
