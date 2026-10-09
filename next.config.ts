import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: process.cwd() },
  async redirects() {
    return [
      // The homepage is task 2; expose the setup preview until it is built.
      { source: "/", destination: "/uncharted?from=home", permanent: false },
    ];
  },
};
export default config;
