import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (anonKey) {
  try {
    const payload = JSON.parse(Buffer.from(anonKey.split('.')[1], 'base64').toString());
    if (payload.role === 'service_role') {
      throw new Error('ATURADOR CRÍTIC: Has posat la clau service_role a VITE_SUPABASE_ANON_KEY! Risc massiu d\'exfiltració de dades. Aturant build.');
    }
  } catch (e) {
    if (e.message.includes('ATURADOR')) throw e;
  }
}
export default defineConfig(() => ({
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
  test: {
    environment: 'jsdom',
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', '_wiki_de_poble/**'],
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true
  }
}));
