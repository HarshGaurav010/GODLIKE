import type { NextConfig } from "next";

const config: NextConfig = {
  // Preserve the repository's user-owned instructions.
  agentRules: false,
  turbopack: { root: process.cwd() },
  async redirects() {
    return [
      // The homepage is task 2; expose the setup preview until it is built.
      { source: "/", destination: "/uncharted?from=home", permanent: false },
    ];
  },
};
export default config;
