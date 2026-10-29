import pluginCypress from 'eslint-plugin-cypress/flat';
import baseConfig from '../../eslint.config.mjs';
import legacyRuleOverrides from '../../tools/eslint/legacy-rule-overrides.mjs';

export default [
  ...baseConfig,
  pluginCypress.configs.recommended,
  ...legacyRuleOverrides,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
