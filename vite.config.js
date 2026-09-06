import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => ({
  plugins: [
    react({
      jsxImportSource: 'react',
    })
  ],

  server: {
    host: true,
    port: 3340,
    strictPort: true,
    watch: {
      ignored: ['**/.agents/**', '**/_wiki_de_poble/**', '**/.gemini/**', '**/scripts/**']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true
  }
}));
