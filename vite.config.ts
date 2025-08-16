import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React and core dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI libraries
          'ui-vendor': [
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
            '@radix-ui/react-label',
            '@radix-ui/react-checkbox',
            'lucide-react',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ],
          
          // Export libraries (heavy dependencies) - split for better loading
          'excel-vendor': ['xlsx'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
          
          // Query and state management
          'state-vendor': ['@tanstack/react-query', '@tanstack/query-core'],
          
          // Other utilities
          'utils-vendor': ['sonner', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 700 // Increase limit for export vendor chunk which is lazy-loaded
  }
}));
