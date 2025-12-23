import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/table/",
  server: {
    host: true,
    port: 80,
    allowedHosts: true,
    hmr: {
      clientPort: 1414,
    },
  },
});
