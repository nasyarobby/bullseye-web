import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: {
        port: 8080,
        proxy: {
            '/api': {
              target: 'http://localhost:3001/',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    },
    plugins: [react()],
});
