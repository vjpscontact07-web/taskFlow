import type { NextConfig } from "next";

import fs from 'fs';
import path from 'path';

// Manual fallback for .env.local if Next.js fails to load it due to root inference issues
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) return;

      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '').trim();
        process.env[key.trim()] = value;
      }
    });
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
