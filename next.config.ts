import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the project root: a stray package-lock.json in the home directory
    // otherwise makes Next.js guess the wrong workspace root.
    root: __dirname,
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
