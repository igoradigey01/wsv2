import {
  Component,
  ChangeDetectionStrategy,  
  OnInit,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
//import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { KatalogComponent } from '@wsv2/ui';
import { IButton } from '@wsv2/app-common';


import { KatlogService } from '../_shared/services/katalog.servise';

@Component({
  selector: 'wsv2-index-shop',
  standalone: true,
  imports: [CommonModule, KatalogComponent],
  templateUrl: './index-shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./index-shop.component.scss'],
})
export class IndexShopComponent implements OnInit {
  katalogs = computed(() =>
    this.repositoryCatalog.Katalogs().filter((f) => f.hidden == false)
  );

  /*  efRef:EffectRef=effect(
    ()=>{
      if(this.repositoryCatalog.Katalogs().length>0){
        this.katalogs.set(this.repositoryCatalog.Katalogs().filter(f=>f.hidden==false));
       // console.log("effect -------------")
      }
    },
    { allowSignalWrites: true }
  ) */

  constructor(
   
    private repositoryCatalog: KatlogService,
  
    private router: Router
  ) {}

  ngOnInit(): void {
    // если Katalogs().length===1 то перейти сразу в subCatalog
    this.repositoryCatalog.indicatorSubject.subscribe((d) => {
      if (d)
        this.router.navigate([
          '/index/katalogs',
          this.repositoryCatalog.Katalogs()[0].id,
        ]);
    });
  
  }

  ChangeButton(katalog: IButton) {
    this.router.navigate(['/index/katalogs', katalog.id]);
  }
}
