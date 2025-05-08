import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) {
              return "react"; // Group React-related libraries
            }
            if (id.includes("swiper")) {
              return "swiper"; // Group Swiper-related libraries
            }
            return "vendor"; // Group other node_modules into a vendor chunk
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500, // Increase the chunk size warning limit
  },
});
