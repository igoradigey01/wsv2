import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { shopServicesRoutes } from './lib.routes';
import { AboutComponent } from './about/about.component';
import { KakZakazatComponent } from './kak-zakazat/kak-zakazat.component';
import { OplataIDostavkaComponent } from './oplata-i-dostavka/oplata-i-dostavka.component';
import { GarantiyaComponent } from './garantiya/garantiya.component';
//import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { PrivacyComponent } from './privacy-policy/privacy.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(shopServicesRoutes)],
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
export class ShopServicesModule {}
