import { defineConfig } from "vitest/config";
export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        // @ts-ignore
        transformMode: {
            web: [/\.[jt]sx?$/]
        }
    }
});
