import { Rule } from "eslint";
import { ImportDeclaration } from "estree";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Sort your import statements following a customizable array of regex patterns.",
      recommended: true,
      url: ""
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          patterns: {
            type: "array",
            items: {
              type: "string"
            }
          }
        }
      }
    ],
    messages: {
      wrongMatchAll:
        "Import from {{ source }} should occur in the {{ pattern }} group."
    }
  },
  create: function (context) {
    const options = (context?.options[0]?.patterns || []) as string[];
    if (!options.length) return {};

    const regexPatterns = options.map((pattern: string) => new RegExp(pattern));
    const matchAllIndex = options.indexOf(".*");
    const withoutMatchAllPatterns = regexPatterns.slice(0, matchAllIndex);
    let i = 0;
    let lastNode: (ImportDeclaration & Rule.NodeParentExtension) | null = null;

    function matchPattern(importPath: string) {
      while (i < regexPatterns.length) {
        if (regexPatterns[i].test(importPath)) {
          return true;
        }
        i++;
      }
      return false;
    }

    return {
      ImportDeclaration(node) {
        if (!matchPattern(node.source.value as string)) {
          context.report({
            messageId: "wrongMatchAll",
            node: node,
            data: {
              source: node.source.value as string,
              pattern:
                options[
                  withoutMatchAllPatterns.findIndex(p =>
                    p.test(node.source.value as string)
                  )
                ]
            }
          });
        } else if (
          i === matchAllIndex &&
          withoutMatchAllPatterns.some(p => p.test(node.source.value as string))
        ) {
          context.report({
            messageId: "wrongMatchAll",
            node: node,
            data: {
              source: node.source.value as string,
              pattern:
                options[
                  withoutMatchAllPatterns.findIndex(p =>
                    p.test(node.source.value as string)
                  )
                ]
            }
          });
        }
        lastNode = node;
      }
    };
  }
};

export default rule;
