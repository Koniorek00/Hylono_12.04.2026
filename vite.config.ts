import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// P2-5 SEO Fix: Brotli compression for smaller asset delivery
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(), 
        tailwindcss(),
        // P2-5: Brotli compression for production builds
        isProduction && viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 1024, // Only compress files > 1KB
          deleteOriginFile: false,
        }),
        // Also generate gzip for broader compatibility
        isProduction && viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 1024,
          deleteOriginFile: false,
        }),
      ].filter(Boolean),
      // SECURITY: API keys should NEVER be exposed to client-side code
      // Remove process.env definitions - use server-side API routes instead
      // define: {},
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Enable minification and optimization
        minify: 'esbuild',
        // Generate source maps for debugging
        sourcemap: mode === 'development',
        // P0-1 SEO Fix: Reduce chunk size warning threshold to enforce smaller bundles
        chunkSizeWarningLimit: 250,
        rollupOptions: {
          output: {
            // P0-1 SEO Fix: Optimized chunk splitting for smaller initial bundle
            manualChunks: (id) => {
              // React core - stable, rarely changes (keep in initial)
              if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                return 'react-vendor';
              }
              
              // P0-1: Lazy-load framer-motion (not in initial bundle)
              // Components should use: const motion = await import('framer-motion')
              if (id.includes('node_modules/framer-motion/')) {
                return 'framer-motion';
              }
              
              // Lucide icons - tree-shake by importing individual icons
              if (id.includes('node_modules/lucide-react/')) {
                return 'lucide-icons';
              }
              
              // Utilities
              if (id.includes('node_modules/dompurify/') || id.includes('node_modules/focus-trap/')) {
                return 'utils';
              }
              
              // P0-1: Lazy-load recharts (not in initial bundle)
              // Only loaded on pages that need charts
              if (id.includes('node_modules/recharts/')) {
                return 'charts';
              }
              
              // PDF generation library (large - only loaded when needed)
              if (id.includes('node_modules/@react-pdf/')) {
                return 'pdf';
              }
              
              // Partner Studio - large admin bundle, lazy loaded
              if (id.includes('components/partner/')) {
                return 'partner-studio';
              }
            },
            // Named chunks for better debugging
            chunkFileNames: (chunkInfo) => {
              const facadeModuleId = chunkInfo.facadeModuleId 
                ? chunkInfo.facadeModuleId.split('/').pop() 
                : 'chunk';
              return `assets/${chunkInfo.name || facadeModuleId}-[hash].js`;
            },
            // Asset file naming
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name?.split('.') || [];
              const ext = info[info.length - 1];
              
              if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(assetInfo.name || '')) {
                return 'assets/images/[name]-[hash][extname]';
              }
              if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
                return 'assets/fonts/[name]-[hash][extname]';
              }
              if (ext === 'css') {
                return 'assets/css/[name]-[hash][extname]';
              }
              return 'assets/[name]-[hash][extname]';
            },
          },
        },
        // CSS code splitting
        cssCodeSplit: true,
        // Target modern browsers for smaller bundles
        target: 'es2020',
        // P0-1: Enable module preloading for critical chunks
        modulePreload: {
          polyfill: true,
        },
      },
      // Optimize dependencies
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          // P0-1: Remove framer-motion from eager deps - lazy load instead
          'lucide-react',
          'dompurify',
          'focus-trap',
        ],
        // Force pre-bundling even in dev
        force: false,
      },
    };
});
