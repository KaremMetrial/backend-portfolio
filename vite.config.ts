import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';
import purgeCss from 'vite-plugin-purgecss';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // Bundle analyzer for monitoring
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
        // Gzip compression for production
        compression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 10240, // Only compress files larger than 10KB
          deleteOriginFile: false,
        }),
        // Brotli compression for production
        compression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 10240,
          deleteOriginFile: false,
        }),
        // PurgeCSS for Tailwind optimization
        purgeCss({
          content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
          variables: true,
          fontFace: true,
          keyframes: true,
          rejected: true,
          rejectedCss: true,
        }),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Enable minification
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log in production
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
          },
          format: {
            comments: false, // Remove comments
          },
        },
        // Code splitting
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
            },
          },
        },
        // Optimize assets
        assetsInlineLimit: 4096, // Inline assets smaller than 4KB
        chunkSizeWarningLimit: 1000, // Warn for chunks larger than 1MB
      },
      // Performance optimizations
      optimizeDeps: {
        include: ['react', 'react-dom'],
      },
      // CSS optimization
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@import "./src/styles/variables.scss";`,
          },
        },
        modules: {
          localsConvention: 'camelCaseOnly',
        },
      },
    };
});
