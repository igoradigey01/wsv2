import { Component, ChangeDetectionStrategy} from '@angular/core';
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
 

  katalogs = this._repository.Katalogs

  _categoriaNs:Katalog[]=[];
  constructor(
    private _repository: KatlogService,
    private router: Router
    ) { }

 

  ChangeButton(katalog:IButton){

    this.router.navigate(['/index/katalogs',  katalog.id ]);
   // console.log("change sub catalog - " + katalog.id)

  }
}
