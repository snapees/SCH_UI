import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      keepNames: true, // Preserve function and class names
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Group other node_modules into a vendor chunk
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500, // Increase the chunk size warning limit
    minify: false,
  },
});
