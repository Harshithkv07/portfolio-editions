import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // There is an unrelated lockfile higher up in the user's home directory;
  // without this, Next picks that as the workspace root and warns on build.
  outputFileTracingRoot: here,
  // The share-card route reads these off disk at request time. Next cannot see
  // that statically, so without this they are pruned from the deployment and
  // the card 500s in production while working perfectly in development.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/fonts/**", "./public/dither/portrait-1200.png"],
    "/twitter-image": ["./assets/fonts/**", "./public/dither/portrait-1200.png"],
  },
};

export default nextConfig;
