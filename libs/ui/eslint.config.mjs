import baseConfig from '../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';
import storybook from 'eslint-plugin-storybook';
import legacyRuleOverrides from '../../tools/eslint/legacy-rule-overrides.mjs';

export default [
  ...baseConfig,
  ...storybook.configs['flat/recommended'],
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'wsv2',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'wsv2',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  ...nx.configs['flat/angular-template'],
  ...legacyRuleOverrides,
];
