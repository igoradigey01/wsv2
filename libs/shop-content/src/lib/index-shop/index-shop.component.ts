import {
  Component,
  ChangeDetectionStrategy,  
  OnInit,
  computed,
} from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
//import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { KatalogComponent } from '@wsv2/ui';
import { IButton ,UserRole} from '@wsv2/app-common';
import {UserManagerService} from '@wsv2/account-service'

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
  
  katalogs = computed(() =>{
 const catlogs=   this.repositoryCatalog.Katalogs().filter((f) => f.hidden == false)
    // console.log("computed -------------")
    // console.log(JSON.stringify(catlogs));
    return catlogs;
    
  }
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
    private userManager:UserManagerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (queryParam: any) => {
          const opt = queryParam['opt'];
          if(opt){
            this.userManager.SetCustomerOpt(true);

            if(this.userManager.Role()== UserRole.default){
              this.userManager.SetRole( UserRole.opt);
            }

          }
         
      }
  );

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
