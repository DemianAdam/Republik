import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs';

// https://vitejs.dev/config/

const localConfig = {
  plugins: [
    react(),
    tsconfigPaths()
  ],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  base: '/',
  server: {
    allowedHosts: ["bailey-their-seeing-granted.trycloudflare.com"],
    host: true,
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    },
  },
  preview: {
    allowedHosts: ["bailey-their-seeing-granted.trycloudflare.com"],
    host: true,
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    },
  }
}

const defaultConfig = {
  plugins: [
    react(),
    tsconfigPaths()
  ],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  base: '/',
  server: {
    allowedHosts: ["laser-decisions-pens-street.trycloudflare.com"],
    host: true,
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    },
  },
  preview: {
    allowedHosts: ["laser-decisions-pens-street.trycloudflare.com"],
    host: true,
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    },
  }
}


const ghPagesConfig = {
  plugins: [
    react(),
    tsconfigPaths()
  ],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  base: '/Republik/', 
}

export default defineConfig(ghPagesConfig);
