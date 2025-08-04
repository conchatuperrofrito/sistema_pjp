import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";
import fs from "fs";

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), "");

  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      __ADMIN_ROLE_ID__: JSON.stringify(env.ADMIN_ROLE_ID),
      __DOCTOR_ROLE_ID__: JSON.stringify(env.DOCTOR_ROLE_ID),
      __GENERAL_MEDICINE_SPECIALTY_ID__: JSON.stringify(env.GENERAL_MEDICINE_SPECIALTY_ID),
      __DENTISTRY_SPECIALTY_ID__: JSON.stringify(env.DENTISTRY_SPECIALTY_ID),
      __PSYCHOLOGY_SPECIALTY_ID__: JSON.stringify(env.PSYCHOLOGY_SPECIALTY_ID),
      __TOPIC_SPECIALTY_ID__: JSON.stringify(env.TOPIC_SPECIALTY_ID)
    },
    plugins: [
      laravel({
        input: ["resources/app/css/app.css", "resources/app/main.tsx"],
        refresh: true
      }),
      react()
    ],
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()]
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "resources/app")
      }
    },
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "storage/ssl/localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "storage/ssl/localhost.pem"))
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            heroui: ["@heroui/react"]
          }
        }
      }
    }
  };
});
