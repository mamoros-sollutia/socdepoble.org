import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  plugins: [react()],

  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
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
    outDir: 'wordpress-plugin/dist',
    emptyOutDir: true,
    target: 'es2019',
    copyPublicDir: false,
    cssCodeSplit: false,
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    sourcemap: true,
    reportCompressedSize: true,

    lib: {
      entry: path.resolve(__dirname, 'src/wp-standalone.js'),
      name: 'SocDePoble',
      formats: ['es'],
      fileName: () => 'soc-de-poble.standalone.js'
    },

    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        entryFileNames: 'soc-de-poble.standalone.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
}));
