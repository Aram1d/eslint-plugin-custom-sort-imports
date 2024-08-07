import { ESLint } from "eslint";
import SortImports from "./rules/sort-imports.js";

const plugin: ESLint.Plugin = {
  meta: {
    name: "eslint-plugin-custom-sort-imports",
    version: "1.0.0."
  },
  rules: { "sort-imports": SortImports }
};

export const configs = {
  recommended: {
    plugins: ["eslint-plugin-custom-sort-imports"],
    rules: {
      [`eslint-plugin-custom-sort-imports/sort-import`]: ["error"]
    }
  }
};

export const rules = {
  "sort-imports": SortImports
};

export default plugin;
