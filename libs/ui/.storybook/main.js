import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const config = {
  stories: ['../**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    getAbsolutePath("@storybook/addon-mcp"),
    getAbsolutePath("@storybook/addon-docs")
  ],
  staticDirs: ['../assets'],
  framework: {
    name: getAbsolutePath("@storybook/angular"),
    options: {},
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
