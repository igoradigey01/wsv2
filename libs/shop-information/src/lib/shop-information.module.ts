import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { shopInformationRoutes } from './lib.routes';
import {ImageSliderComponent} from '@wsv2/app-common'
import { AboutComponent } from './about/about.component';
import { KakZakazatComponent } from './kak-zakazat/kak-zakazat.component';
import { OplataIDostavkaComponent } from './oplata-i-dostavka/oplata-i-dostavka.component';
import { GarantiyaComponent } from './garantiya/garantiya.component';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { PrivacyComponent } from './privacy-policy/privacy.component';

const mapConfig: YaConfig = {
  apikey: 'ccd3dfd9-9b90-48ee-acb8-9dcb64a82f8a',
  lang: 'en_US',
};

@NgModule({
  imports: [
    CommonModule,
   ImageSliderComponent,
    RouterModule.forChild(shopInformationRoutes),
    AngularYandexMapsModule.forRoot(mapConfig)
  ],
  declarations: [
    AboutComponent,
    KakZakazatComponent,
    OplataIDostavkaComponent,
    GarantiyaComponent,
    PrivacyComponent
  ],
  exports: [
    AboutComponent,
    KakZakazatComponent,
    OplataIDostavkaComponent,
    GarantiyaComponent,
    PrivacyComponent
  ],

})
export class ShopInformationModule { }
