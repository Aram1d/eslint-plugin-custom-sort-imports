# eslint-plugin-import-sorter

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-custom-sort-imports.svg)](https://www.npmjs.com/package/eslint-plugin-import-sorter)
[![Build Status](https://github.com/Aram1d/eslint-plugin-custom-sort-imports/workflows/CI/badge.svg)](https://github.com/Aram1d/eslint-plugin-custom-sort-imports/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`eslint-plugin-custom-sort-imports` is an ESLint plugin that allow you to sort your imports according to a customizable pattern.

## Features

- Sort `import` statements in a custom order according to an array of regex.
- Easily configurable via ESLint configuration file.

## Installation

You can install the plugin via npm:

```sh
npm install eslint-plugin-custom-sort-imports --save-dev
```

yarn

```sh
yarn install -D eslint-plugin-custom-sort-imports
```

bun

```sh
bun install -D eslint-plugin-custom-sort-imports
```

## Configuration

The following code snippet gives a configuration example on `eslint.config.mjs`. The "patterns" array holds some regex to define how to sort your imports

```
import .....
import pluginSortImports from "eslint-plugin-sort-imports";

export default [
  {
    plugins: {
      "eslint-plugin-custom-sort-imports": pluginSortImports
    },
    rules: {
      "eslint-plugin-custom-sort-imports/sort-imports": [
        "error",
        {
          patterns: [
            "^react$",
            "^react-.*",
            "^@tanstack/.*",
            "^@auth0/.*",
            "^zustand.*",
            "^@mantine/.*(?!.css$)$",
            "^@mantine/.*(?<!.css$)$",
            "@tabler/icons-react",
            ".*"
          ]
        }
      ],
    }
  }
];

```
