import { ESLint } from "eslint";
import sortImports from "./rules/sort-imports.js";
import pkg from "../package.json";

const plugin: ESLint.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version
  },
  rules: { "sort-imports": sortImports }
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
  "sort-imports": sortImports
};

export default plugin;
