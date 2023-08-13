import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
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
  styleUrls: ['./index-shop.component.scss'],
})
export class IndexShopComponent implements OnInit {
  katalogs: IButton[] = [
    
  ];

  _categoriaNs:Katalog[]=[];
  constructor(
    private _repository: KatlogService,
    private router: Router
    ) { }

  ngOnInit(): void {
    //debugger
    this._repository.Katalogs().subscribe({
      next: (data) => {
        this.katalogs = data;
        console.log( this.katalogs);
      },
      error: (err:HttpErrorResponse) => console.error('load katalog err: --' + err.message)
    });
  }

  ChangeButton(katalog:IButton){

    this.router.navigate(['/index/subkatalogs',  katalog.id ]);
    console.log("change sub catalog - " + katalog.id)

  }
}
