# App-styles lib

 ## mat3 generate palette !!!!
     - https://m3.material.io/theme-builder#/custom 

  1.  Базовая - Material Theme -для  app и libs
     - https://material.angular.io/guide/theming

  2.  Material palette generator- for M3: Primary Secondary Tertiary and Neutral
      - задает значение Primary Secondary Tertiary and Neutral по разработанному google алгоритму
      - исходя из занчения Primary которое в версии android 12 задается исходя из  выбора темы рабочего стола телефона пользователем.

      * M3 
       -  https://m3.material.io/theme-builder#/custom 

      *  Material palette generator- for M2 Primary Secondary  and Neutral
        - https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors 

  3. неплохой обзор   -Material Theme Builder- на ютубе
        -  https://www.youtube.com/watch?v=ax9eoeZh9Ic

  4.  Варианты -Themes-
      - https://colorhunt.co
      -  https://colorswall.com/palette/generate


  5. Визуализировать созданную -Themes- или сгенерировать palette : main light dark
      - https://materialtheme.arcsine.dev


## обзор M2(Material) 
    - https://m2.material.io/design/color/the-color-system.html#color-theme-creation

## обзор M3(Material You): Primary Secondary Tertiary and Neutral
     - https://m3.material.io/
     -  https://habr.com/ru/companies/surfstudio/articles/653115/


## создать логотип (генератор)
 https://mybrandnewlogo.com/ru/sozdat-logotip 

##  reset.scss
```
Базовый миксин сброса стилей. 
Вызывается один раз ,при старте приложения

```

##  s.mixin-mat-component-themes($my-theme)
,,,
затает занчения -Theme-  только для используемых в приложении -Material Components-
https://material.angular.io/components/categories
,,,

## миксин @include mat.core();
,,,
Angular Material определяет mixin named core , 
который включает необходимые стили для общих функций,
 используемых несколькими компонентами. 
 !!! Основной миксин должен быть включен ровно один раз для вашего приложения !!!, 
 даже если вы определяете несколько тем. 
 Включение основного миксина несколько раз приведет к дублированию CSS в вашем приложении.
 задаем в apps/my-app/src/styles.scss
,,,

## @function HexToRGB($hex)
  - Для использования прозрачности в Sass необходимо использовать цвет в RGB формате

## variables.scss
 1.  переменные в scss и css3 формате
    - https://habr.com/ru/articles/533084/
    - https://materialtheme.arcsine.dev/


## Scss
  - https://sass-lang.su/documentation/at-rules/use


### sample-m2-palette.scss
```
файл  неиспользуется .это просто пример
https://m2.material.io/design/color/the-color-system.html#color-theme-creation
```
### sample-m3-palette.scss
```
файл  неиспользуется .это просто пример
https://m3.material.io/styles/color/the-color-system/color-roles
```
### temp-m3-page.scss
 * файл  неиспользуется .Temp
