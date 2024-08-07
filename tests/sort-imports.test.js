import { describe } from "vitest";
import parser from "@typescript-eslint/parser-v5";
import plugin from "../src";
import rule from "../src/rules/sort-imports";

import { RuleTester } from "eslint";

const languageOptionsV9 = {
  ecmaVersion: 6,
  sourceType: "module",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
};

function js(chunks, ...args) {
  return chunks.reduce((acc, chunk, index) => {
    return acc + chunk + String(args[index]);
  }, "");
}

const goodImports = js`
  import React, {ReactNode} from "react";
  import * as b from "react-router-dom";
  import * as c from "react-intl";
  import * as d from "@mantine/core";
  import * as e from "@mantine/hooks";
  import * as f from "@tabler/icons-react";
  import * as g from "lodash-es";
  import * as h from "@config/routing";
  import * as i from "@components";
  import * as j from "@hooks";
  import * as k from "@utils/functions";
  import * as l from "@utils/styles.module.css";
`;

const wrongImports = js`
  import React, {ReactNode} from "react";
  import * as c from "react-intl";
  import * as d from "@mantine/core";
  import * as b from "react-router-dom";
  import * as g from "lodash-es";
  import * as e from "@mantine/hooks";
  import * as h from "@config/routing";
  import * as i from "@components";
  import * as j from "@hooks";
  import * as k from "@utils/functions";
  import * as l from "@utils/styles.module.css";
  import * as f from "@tabler/icons-react";
 
`;

const beginWrongImports = js`
  import * as e from "@mantine/hooks";
  import React, {ReactNode} from "react";
`;

const emptyImports = "";

const patterns = [
  "^react$",
  "^react-.*",
  "^@mantine/.*",
  "^@tabler/icons-react$",
  ".*"
];

describe("sort-imports", () => {
  new RuleTester({
    languageOptions: {
      ...languageOptionsV9,
      parser
    },
    plugins: {
      "eslint-plugin-semantic": plugin
    },
    rules: {
      "eslint-plugin-semantic/sort-imports": "error"
    }
  }).run("sort-import", rule, {
    valid: [
      {
        name: "good imports",
        code: goodImports,
        options: [{ patterns }]
      },
      {
        name: "empty imports",
        code: emptyImports,
        options: [{ patterns }]
      }
    ],
    invalid: [
      {
        name: "wrong imports",
        code: wrongImports,
        options: [{ patterns }],
        errors: [
          {
            messageId: "wrongImportPosition",
            data: {
              source: "react-router-dom",
              pattern: "^react-.*",
              before: "react-intl",
              after: "@mantine/core"
            }
          },
          {
            messageId: "wrongImportPosition",
            data: {
              source: "@mantine/hooks",
              pattern: "^@mantine\\/.*",
              before: "@mantine/core",
              after: "lodash-es"
            }
          },
          {
            messageId: "wrongImportPosition",
            data: {
              source: "@tabler/icons-react",
              pattern: "^@tabler\\/icons-react$",
              before: "@mantine/hooks",
              after: "lodash-es"
            }
          }
        ]
      },
      {
        name: "small wrong imports",
        code: beginWrongImports,
        options: [{ patterns }],
        errors: [
          {
            messageId: "wrongImportPosition",
            data: {
              source: "react",
              pattern: "^react$",
              before: "begin of file",
              after: "@mantine/hooks"
            }
          }
        ]
      }
    ]
  });
});
