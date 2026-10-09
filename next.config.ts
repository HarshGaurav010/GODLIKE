import type { NextConfig } from "next";

const config: NextConfig = {
  // Preserve the repository's user-owned instructions.
  agentRules: false,
  turbopack: { root: process.cwd() },
  async redirects() {
    return [
      // The source site serves its homepage at /home too.
      { source: "/home", destination: "/", permanent: false },
    ];
  },
};
export default config;
