import solid from "solid-start/vite";
import vercel from "solid-start-vercel";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({
      extensions: [".mdx", ".md"],
      adapter: vercel({ edge: true }),
    }),
  ],
});
