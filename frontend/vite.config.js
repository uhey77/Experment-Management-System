import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        },
        server: {
            port: Number(env.FRONTEND_PORT || 5173),
            host: "0.0.0.0",
        },
    };
});
