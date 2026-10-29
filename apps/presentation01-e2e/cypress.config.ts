import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname, {
      ciWebServerCommand: 'npx nx run presentation01:serve-static',
      webServerCommands: {
        default: 'npx nx run presentation01:serve:development',
        production: 'npx nx run presentation01:serve:production',
        ci: 'npx nx run presentation01:serve-static',
      },
    }),
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
