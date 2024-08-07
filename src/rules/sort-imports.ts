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
      wrongImportPosition:
        "Import from {{ source }} matches {{ pattern }} pattern and should occur between {{ before }} and {{ after }}."
    }
  },
  create: function (context) {
    const options = (context?.options[0]?.patterns || []) as string[];
    if (!options.length) return {};

    const regexPatterns = options.map((pattern: string) => new RegExp(pattern));
    const matchAllIndex = options.indexOf(".*");
    const withoutMatchAllPatterns = regexPatterns.filter(
      (_, i) => i !== matchAllIndex
    );

    const importStatementsMap: Map<string, ImportDeclaration> = new Map();
    const importStatements: string[] = [];

    function recursiveReportDiff({ actual, expected }: sortDiffArg) {
      for (let i = 0; i < expected.length; i++) {
        if (expected[i] !== actual[i]) {
          const updatedActual = [
            ...actual.slice(0, i),
            expected[i],
            ...actual.slice(i).filter(item => item !== expected[i])
          ];

          context.report({
            node: importStatementsMap.get(expected[i])!,
            messageId: "wrongImportPosition",
            data: {
              source: expected[i],
              pattern:
                withoutMatchAllPatterns.find(p => p.test(expected[i]))
                  ?.source ?? ".*",
              before: updatedActual[i - 1],
              after: updatedActual[i + 1]
            }
          });
          recursiveReportDiff({ actual: updatedActual, expected });
          break;
        }
      }
    }

    return {
      Program() {
        importStatementsMap.clear();
        importStatements.length = 0;
      },
      ImportDeclaration(node) {
        importStatementsMap.set(node.source.value as string, node);
        importStatements.push(node.source.value as string);
      },
      "Program:exit"() {
        const sortedImports: string[][] = [];
        const matchAllImports: string[] = [];

        importStatements.forEach(importStatement => {
          const matchIndex = withoutMatchAllPatterns.findIndex(p =>
            p.test(importStatement)
          );
          matchIndex === -1
            ? matchAllImports.push(importStatement)
            : (sortedImports[matchIndex] = [
                ...(sortedImports?.[matchIndex] ?? []),
                importStatement
              ]);
        });

        const reorganizedImports = [
          ...sortedImports.slice(0, matchAllIndex),
          matchAllImports,
          ...sortedImports.slice(matchAllIndex)
        ];

        recursiveReportDiff({
          actual: importStatements,
          expected: reorganizedImports.flat().filter(Boolean)
        });
      }
    };
  }
};

export default rule;

type sortDiffArg = {
  actual: string[];
  expected: string[];
};
