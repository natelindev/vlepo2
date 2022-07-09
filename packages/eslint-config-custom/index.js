module.exports = {
  extends: [
    "next",
    "airbnb",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:relay/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "@typescript-eslint", "relay"],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    react: {
      version: "detect",
    },
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        arrowParens: "always",
        bracketSpacing: true,
        printWidth: 100,
        proseWrap: "preserve",
        requirePragma: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "all",
        useTabs: false,
        endOfLine: "auto",
      },
      {
        usePrettierrc: false,
      },
    ],
    quotes: [
      1,
      "single",
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    "react/require-default-props": "off",
    // Disabling because this rule is extremely slow.
    "import/no-cycle": "off",
    // Disabling because this rule is slow and not a common violation.
    "import/no-named-as-default": "off",
    // Disabling because this rule is slow and not a common violation.
    "import/no-named-as-default-member": "off",
    // This rule is already covered by the TypeScript compiler.
    "import/default": "off",
    // This rule is already covered by the TypeScript compiler.
    "import/no-unresolved": "off",
    // This rule is already covered by vscode import-sorter
    "import/order": "off",
    "operator-linebreak": "off",
    "no-shadow": "off",
    indent: "off",
    "arrow-parens": "off",
    "no-confusing-arrow": "off",
    "no-use-before-define": "off",
    "object-curly-newline": "off",
    "function-paren-newline": "off",
    "import/prefer-default-export": "off",
    "max-classes-per-file": "off",
    "react/jsx-filename-extension": "off",
    "react/jsx-props-no-spreading": "off",
    // conflict with prettier
    "react/jsx-curly-newline": "off",
    "import/extensions": "off",
    "implicit-arrow-linebreak": "off",
    // needed for relay
    camelcase: "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    // react 17 no longer need imports
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    // support for __typename
    "no-underscore-dangle": "off",
    // support for relay connection
    "@typescript-eslint/no-non-null-assertion": "off",
    // needed for interface merging
    "@typescript-eslint/no-empty-interface": "off",
    "relay/generated-flow-types": "off",
    // typescript covered
    "react/prop-types": "off",
    "react/function-component-definition": "off",
    "react/no-arrow-function-lifecycle": "off",
    "react/no-invalid-html-attribute": "off",
    "react/no-unused-class-component-methods": "off",
    "react/jsx-no-constructed-context-values": "off",
    "@next/next/no-html-link-for-pages": "off",
  },
};
