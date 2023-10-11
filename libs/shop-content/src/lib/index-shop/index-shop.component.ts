import { Component, ChangeDetectionStrategy,effect,EffectRef, signal} from '@angular/core';
import { Router  } from '@angular/router';
//import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { KatalogComponent } from '@wsv2/ui';
import {Katalog,IButton} from '@wsv2/app-common'
import { KatlogService } from '../_shared/services/katalog.servise'




@Component({
  selector: 'wsv2-index-shop',
  standalone: true,
  imports: [CommonModule, KatalogComponent],
  templateUrl: './index-shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./index-shop.component.scss'],
})
export class IndexShopComponent  {
 

      
  katalogs =  signal<Katalog[]>([]);

  efRef:EffectRef=effect(
    ()=>{
      if(this._repository.Katalogs().length>0){
        this.katalogs.set(this._repository.Katalogs().filter(f=>f.hidden==false));
       // console.log("effect -------------")
      }
    },
    { allowSignalWrites: true }
  )

  constructor(
    private _repository: KatlogService,
    private router: Router
    ) {
         
      
      // если Katalogs().length===1 то перейти сразу в subCatalog
      _repository.indicatorSubject.subscribe(d=>{
      if(d)  this.router.navigate(['/index/katalogs', _repository.Katalogs()[0].id ]);
    
      }
      );
     }

   

  ChangeButton(katalog:IButton){

    this.router.navigate(['/index/katalogs',  katalog.id ]);
   // console.log("change sub catalog - " + katalog.id)

  }
}
