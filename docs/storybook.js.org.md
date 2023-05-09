## get started

```
https://storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started/
https://habr.com/ru/companies/simbirsoft/articles/729066/
```

## youtube

https://www.youtube.com/@chromaticui

## Next-level component development and testing

https://storybook.js.org/blog/storybook-7-0/

## GitHub

https://github.com/storybookjs/storybook

## Обзор -для чего нужен(ru)

https://habr.com/ru/articles/340384/

## Create

```
 //сначало создаем app or lib
 npx create-nx-workspace@latest wsx01_sb
   -create a new workspace
   -change angular app
    //  nx = > 16.0  потом добавляеи storyBook
 nx g @nx/angular:storybook-configuration ui --storybook7Configuration=true
```

## Add style.css

```
    "storybook": {
      "executor": "@storybook/angular:start-storybook",
      "options": {
        "port": 4400,
        "configDir": "libs/ui/.storybook",
        "browserTarget": "ui:build-storybook",

        "styles": ["libs/ui/src/style.css"],
        "stylePreprocessorOptions": {
          "includePaths": ["libs/ui/src/style.css"]
        },

        "compodoc": false
      },
      "configurations": {
        "ci": {
          "quiet": true
        }
      }
    },
    "build-storybook": {
      "executor": "@storybook/angular:build-storybook",
      "outputs": ["{options.outputDir}"],
      "options": {
        "outputDir": "dist/storybook/ui",
        "configDir": "libs/ui/.storybook",
        "browserTarget": "ui:build-storybook",

        "styles": ["libs/ui/src/style.css"],
        "stylePreprocessorOptions": {
          "includePaths": ["libs/ui/src/style.css"]
        },

        "compodoc": false
      },
```

## Serving static files via Storybook Configuration

- https://storybook.js.org/docs/angular/configure/images-and-assets

- создать Statik(assets) dir для storybook lib

```
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
 stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
 addons: [
   '@storybook/addon-links',
   '@storybook/addon-essentials',
   '@storybook/addon-interactions',
 ],
 staticDirs: ['../public'], //👈 Configures the static asset folder in Storybook
};

export default config;
```

- использовать файлы из Statik(assets) dir

```
// MyComponent.stories.ts

import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
/* 👇 The title prop is optional.
 * See https://storybook.js.org/docs/angular/configure/overview#configure-story-loading
 * to learn how to generate automatic titles
 */
title: 'img',
component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

// Assume image.png is located in the "public" directory.
export const WithAnImage: Story = {
render: () => ({
  props: {
    src: '/image.png',
    alt: 'my image',
  },
}),
};
```

## создать документацию

```
https://nx.dev/packages/storybook/documents/angular-storybook-compodoc
yarn add -D @compodoc/compodoc
```

## npm не туда устанавливает пакеты и выдает ошибку?

```
Прислали решение, кому интересно:
npm get prefix
выводит:
C:\users\your_user\AppData\Roaming\npm

Соответственно помогло:
npm config set prefix="C:\Users\your_user\AppData\Roaming\npm"
```

## error dev-server

```
очистить кеш
 node_modules/.cache/storybook/dev-server
```
