module.exports = {
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/__tests__/**/*"],
      env: {
        jest: true,
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "@typescript-eslint"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
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
    // conflict with prettier
    quotes: "off",
    "import/extensions": "off",
    "implicit-arrow-linebreak": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};
