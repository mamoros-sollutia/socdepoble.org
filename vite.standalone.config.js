import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],

  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react/jsx-runtime': path.resolve(__dirname, 'src/shims/jsx-runtime.js')
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
      formats: ['iife'],
      fileName: () => 'soc-de-poble.standalone.js'
    },

    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client'],
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'soc-de-poble.standalone.js',
        assetFileNames: 'assets/[name][extname]',
        globals: {
          'react': 'wp.element',
          'react-dom': 'wp.element',
          'react-dom/client': 'wp.element'
        }
      }
    }
  }
});
