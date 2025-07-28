import { fileURLToPath, URL } from "node:url";
import { templateCompilerOptions } from "@tresjs/core";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => {
            const tresCustomElement =
              templateCompilerOptions?.template?.compilerOptions
                ?.isCustomElement;

            return tresCustomElement ? tresCustomElement(tag) : false;
          },
        },
      },
    }),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
