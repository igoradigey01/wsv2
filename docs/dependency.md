# dependency and Соглашения

## Asp net core(server api)

```
включает 3 project
ShopAPI //основной
EmailService // отправка mail
ShopDb  // взаимодействие с субд mysql

```

## dependency monorepo external packed

```
https://github.com/Mawi137/ngx-image-cropper
https://github.com/parallax/jsPDF
https://www.npmjs.com/package/ng-qrcode
https://material.angular.io/components/categories
https://github.com/ddubrava/angular8-yandex-maps#readme
```

### Angular Yarn

http://prgssr.ru/development/yarn-ili-npm-vse-chto-vam-nuzhno-znat.html#heading-yarn--npm----- <br/>
https://habr.com/ru/post/554944/<br/>
npm install -g yarn<br/>

### angular-material , angular-animations and angular-cdk

yarn add @angular/material @angular/cdk @angular/animations <br/>

### External Provider для lib account

yarn add i @abacritt/angularx-social-login <br/>
[help and sample](https://code-maze.com/how-to-sign-in-with-google-angular-aspnet-webapi/) <br/>

### Yandex maps

```
yarn add angular8-yandex-maps
https://github.com/ddubrava/angular8-yandex-maps#readme
```

### image-cropper

ui/img-render/img-render.component.ts <br/>
image-cropper is Martijn <br/>
https://github.com/Mawi137/ngx-image-cropper <br/>

### Angular PDF

help : https://mrrio.github.io/jsPDF/examples/basic.html <br>
npm install -g yarn<br/>
yarn add jspdf <br/>
//download fonts <br/>
https://fonts.google.com/ <br/>
//unzip <br/>
//convert<br/>
https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html <br/>
add file to assets/font/my-font.js <br/>
delete : import { jsPDF } from "jspdf"; and function <br/>
add angular.json /first prodject section / "scripts": ["src/assets/fonts/my-font.js"] <br/>
add ( declare var font: any; ) header qr-code.component.ts <br/>
restart ( ng s )<br/>
or see js-pdf.service.ts<br/>
