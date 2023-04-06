import { Route } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { KakZakazatComponent } from './kak-zakazat/kak-zakazat.component';
import { OplataIDostavkaComponent } from './oplata-i-dostavka/oplata-i-dostavka.component';
import { GarantiyaComponent } from './garantiya/garantiya.component';
import { PrivacyComponent } from './privacy-policy/privacy.component';

export const shopInformationRoutes: Route[] = [
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'kak-zakazat',
    component: KakZakazatComponent
  },
  {
    path: 'oplata-i-dostavka',
    component: OplataIDostavkaComponent
  },
  {
    path: 'garantiya',
    component: GarantiyaComponent
  },

  {
    path: 'privacy',
    component: PrivacyComponent
  }
];
