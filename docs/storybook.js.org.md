## get started
https://storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started/

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

## npm не туда устанавливает пакеты и выдает ошибку?
```
Прислали решение, кому интересно:
npm get prefix
выводит:
C:\users\your_user\AppData\Roaming\npm

Соответственно помогло:
npm config set prefix="C:\Users\your_user\AppData\Roaming\npm"
```