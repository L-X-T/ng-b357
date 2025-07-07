# 01 Project Setup & Style Guide

<!-- TOC -->
- [Prettify all files](#prettify-all-files)
  - [Add bracketSpacing](#add-bracketspacing)
  - [Bonus: Additional rules](#bonus-additional-rules)
- [ESLint rules](#eslint-rules)
  - [Bonus: Share feedback or improvements](#bonus-share-feedback-or-improvements)
<!-- /TOC -->

In this lab, we'll explore setup and style guide best practices for Angular applications.

**Lab time:** 30–45 minutes

## Prettify all files

1. Go to your current project (or select one).
   > **Note:** When working on your real project, commit all changes, then create a new branch for our experiments.
2. Install the **Prettier** extension in both your project and your IDE.
3. Prettify all files (using your IDE or the CLI) with this config in `.prettierrc.json`:
   ```json
   {
     "singleQuote": true,
     "printWidth": 120
   }
   ```
4. Review the diffs in your files using Git.
5. Prepare to report your findings to the group.

### Add bracketSpacing

Update `.prettierrc.json` to include `bracketSpacing: true`, then run Prettier again:

```json
{
  "singleQuote": true,
  "printWidth": 120,
  "bracketSpacing": true
}
```

Prettify once more. Which configuration do you prefer?

### Bonus: Additional rules

Do you see areas for improvement with additional rules? If so, share your feedback with your trainer!

## ESLint rules

1. To set up **Angular ESLint**, add the following `devDependencies` to your `package.json` (or newer):
   ```json
   {
     "devDependencies": {
       "angular-eslint": "^19.6.0",
       "eslint": "^9.27.0",
       "eslint-config-prettier": "^10.1.5",
       "eslint-plugin-prettier": "^5.4.1",
       "prettier": "^3.5.3",
       "typescript-eslint": "^8.33.0"
     }
   }
   ```
2. Apply these ESLint rules to your project:

<details>
<summary>Show ESLint configuration</summary>

```js
// eslint.config.js
// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    ignores: ['.angular/**', '.nx/**', 'coverage/**', 'dist/**'],
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      eslintConfigPrettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: ['attribute', 'element'],
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      // Angular best practices
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/prefer-output-readonly': 'warn',
      '@angular-eslint/prefer-signals': 'warn',
      '@angular-eslint/prefer-standalone': 'warn',

      // TypeScript best practices
      '@typescript-eslint/array-type': ['warn'],
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'no-public',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
      ],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',

      // JavaScript best practices
      eqeqeq: 'error',
      complexity: ['error', 20],
      curly: 'error',
      'guard-for-in': 'error',
      'max-classes-per-file': ['error', 1],
      'max-len': [
        'warn',
        {
          code: 120,
          comments: 160,
        },
      ],
      'max-lines': ['error', 400], // my favorite rule to keep files small
      'no-bitwise': 'error',
      'no-console': 'off',
      'no-new-wrappers': 'error',
      'no-useless-concat': 'error',
      'no-var': 'error',
      'no-restricted-syntax': 'off',
      'no-shadow': 'error',
      'one-var': ['error', 'never'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          allowSeparatedGroups: true,
        },
      ],

      // Security
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      // Angular template best practices
      '@angular-eslint/template/attributes-order': [
        'error',
        {
          alphabetical: true,
          order: [
            'STRUCTURAL_DIRECTIVE', // deprecated, use @if and @for instead
            'TEMPLATE_REFERENCE', // e.g. `<input #inputRef>`
            'ATTRIBUTE_BINDING', // e.g. `<input required>`, `id="3"`
            'INPUT_BINDING', // e.g. `[id]="3"`, `[attr.colspan]="colspan"`,
            'TWO_WAY_BINDING', // e.g. `[(id)]="id"`,
            'OUTPUT_BINDING', // e.g. `(idChange)="handleChange()"`,
          ],
        },
      ],
      '@angular-eslint/template/button-has-type': 'warn',
      '@angular-eslint/template/cyclomatic-complexity': ['warn', { maxComplexity: 10 }],
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'warn',
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
      '@angular-eslint/template/use-track-by-function': 'warn',
    },
  },
);
```

</details>

3. Run ESLint on your project and review the reported issues.
4. Choose at least one issue to report back to the team.

### Bonus: Share feedback or improvements

Do you have suggestions to improve this setup? Share your feedback with your trainer!
