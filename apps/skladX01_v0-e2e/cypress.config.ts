const { nxE2EPreset } = require('@nx/cypress/plugins/cypress-preset');
const { defineConfig } = require('cypress');
module.exports = defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: process.env['CI']
          ? 'npx nx run skladX01_v0:serve-static'
          : 'npx nx run skladX01_v0:serve',
        production: 'npx nx run skladX01_v0:serve-static',
      },
      ciWebServerCommand: 'npx nx run skladX01_v0:serve-static',
      ciBaseUrl: 'http://localhost:4200',
    }),
    baseUrl: 'http://localhost:4200',
    screenshotOnRunFailure: false,
    video: false,
  },
});
