import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nx from '@nx/eslint-plugin';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...nx.configs['flat/base'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:x01',
              onlyDependOnLibsWithTags: ['scope:x01', 'type:01-lib'],
            },
            {
              sourceTag: 'scope:xf01',
              onlyDependOnLibsWithTags: ['scope:xf01', 'type:01-lib'],
            },
            {
              sourceTag: 'scope:xl01',
              onlyDependOnLibsWithTags: ['scope:xl01', 'type:01-lib'],
            },
            {
              sourceTag: 'scope:shagen01',
              onlyDependOnLibsWithTags: ['scope:shagen01', 'type:01-lib'],
            },
            {
              sourceTag: 'scope:hadjoh01',
              onlyDependOnLibsWithTags: ['scope:hadjoh01', 'type:01-lib'],
            },
            {
              sourceTag: 'scope:01account-lib',
              onlyDependOnLibsWithTags: ['scope:01account-lib', 'type:01-lib'],
            },
            {
              sourceTag: 'scope:01mystylelib-lib',
              onlyDependOnLibsWithTags: [
                'scope:01mystylelib-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: 'scope:01app-config-lib',
              onlyDependOnLibsWithTags: [
                'scope:01app-config-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: 'scope:01common-lib',
              onlyDependOnLibsWithTags: ['scope:01common-lib', 'type:01-lib'],
            },
            {
              sourceTag: 'scope:01app-layout-lib',
              onlyDependOnLibsWithTags: [
                'scope:01app-layout-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: 'scope:01app-styles-lib',
              onlyDependOnLibsWithTags: [
                'scope:01app-styles-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: '01app-shop-information-lib',
              onlyDependOnLibsWithTags: [
                '01app-shop-information-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: '01app-ui-lib',
              onlyDependOnLibsWithTags: ['01app-ui-lib', 'type:01-lib'],
            },
            {
              sourceTag: '01app-shop-content-lib',
              onlyDependOnLibsWithTags: [
                '01app-shop-content-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: '01app-shop-orders-lib',
              onlyDependOnLibsWithTags: [
                '01app-shop-orders-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: '01app-shop-order-lib',
              onlyDependOnLibsWithTags: ['01app-shop-order-lib', 'type:01-lib'],
            },
            {
              sourceTag: '01app-shop-cart-lib',
              onlyDependOnLibsWithTags: ['01app-shop-cart-lib', 'type:01-lib'],
            },
            {
              sourceTag: '01app-js-pdf-lib',
              onlyDependOnLibsWithTags: ['01app-js-pdf-lib', 'type:01-lib'],
            },
            {
              sourceTag: '01app-shop-sub-content-lib',
              onlyDependOnLibsWithTags: [
                '01app-shop-sub-content-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: 'scope:01app-admin-page-lib',
              onlyDependOnLibsWithTags: [
                'scope:01app-admin-page-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: 'scope:01app-manage-page-lib',
              onlyDependOnLibsWithTags: [
                'scope:01app-manage-page-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: 'scope:01app-shop-op-lib',
              onlyDependOnLibsWithTags: [
                'scope:01app-shop-op-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: 'scope:01app-user-order-lib',
              onlyDependOnLibsWithTags: [
                'scope:01app-user-order-lib',
                'type:01-lib',
              ],
            },
            {
              sourceTag: 'scope:01app-user-profile-lib',
              onlyDependOnLibsWithTags: [
                'scope:01app-user-profile-lib',
                'type:01-lib',
              ],
            },
          ],
        },
      ],
    },
  },
  ...nx.configs['flat/typescript'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // typescript-eslint v8 removed @typescript-eslint/no-extra-semi in
      // favour of the base rule; keep the user's configured check enforced.
      'no-extra-semi': 'error',
    },
  },
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      // typescript-eslint v8 removed @typescript-eslint/no-extra-semi in
      // favour of the base rule; keep the user's configured check enforced.
      'no-extra-semi': 'error',
    },
  },
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
];
