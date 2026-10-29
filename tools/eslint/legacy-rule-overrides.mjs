/**
 * Flat-config adjustments applied at the end of every project config, so they
 * win over the presets each project spreads.
 *
 * Two groups:
 *
 * 1. Rules that the @angular-eslint v20 / typescript-eslint v8 recommended
 *    sets enable but that this workspace never enforced before the ESLint v9
 *    flat-config migration. Disabling them keeps the migration from turning
 *    existing code into lint errors; no source file is edited for them.
 * 2. The `no-extra-semi` rule the workspace explicitly configured. The
 *    presets disable it because it is deprecated upstream, so it is
 *    re-asserted here to keep the user's check enforced.
 */

const newlyEnabledRulesOff = {
  files: ['**/*.ts', '**/*.tsx'],
  rules: {
    '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    '@angular-eslint/prefer-inject': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
  },
};

const newlyEnabledTemplateRulesOff = {
  files: ['**/*.html'],
  rules: {
    '@angular-eslint/template/alt-text': 'off',
    '@angular-eslint/template/click-events-have-key-events': 'off',
    '@angular-eslint/template/interactive-supports-focus': 'off',
    '@angular-eslint/template/prefer-control-flow': 'off',
  },
};

const noExtraSemi = {
  files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  rules: {
    'no-extra-semi': 'error',
  },
};

export default [
  newlyEnabledRulesOff,
  newlyEnabledTemplateRulesOff,
  noExtraSemi,
];
