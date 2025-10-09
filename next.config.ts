import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚀 Ignore toutes les erreurs ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🚀 Ignore les erreurs TypeScript (no-explicit-any, etc.)
  typescript: {
    ignoreBuildErrors: true,
  },

  // (optionnel) tu peux aussi activer d'autres optimisations ici si tu veux
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

export default nextConfig;
