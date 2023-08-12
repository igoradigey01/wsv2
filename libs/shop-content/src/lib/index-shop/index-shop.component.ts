import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { KatalogComponent, IButton } from '@wsv2/ui';
import {Katalog} from '@wsv2/app-common'
import { KatlogService } from '../_shared/services/katalog.servise'
import {
  catchError,  
  map,
  tap,  
  shareReplay,  
} from 'rxjs';

@Component({
  selector: 'wsv2-index-shop',
  standalone: true,
  imports: [CommonModule, KatalogComponent],
  templateUrl: './index-shop.component.html',
  styleUrls: ['./index-shop.component.scss'],
})
export class IndexShopComponent implements OnInit {
  tempRepozitory: IButton[] = [
    // <IButton>{ id: 1, name: 'каталог-1' },
    // <IButton>{ id: 2, name: 'каталог-2' },
    // <IButton>{ id: 3, name: 'каталог-3' },
    // <IButton>{ id: 4, name: 'каталог-4' },
    // <IButton>{ id: 5, name: 'каталог-5' },
    // <IButton>{ id: 6, name: 'каталог-6' },
    // <IButton>{ id: 7, name: 'каталог-7' },
    // <IButton>{ id: 8, name: 'каталог-8' },
    // <IButton>{ id: 9, name: 'каталог-9' },
    // <IButton>{ id: 10, name: 'каталог-10' },
    // <IButton>{ id: 11, name: 'каталог-11' },
  ];

  _categoriaNs:Katalog[]=[];
  constructor(private _repository: KatlogService) { }

  ngOnInit(): void {
    //debugger
    this._repository.Katalogs().subscribe({
      next: (data) => {
        this.tempRepozitory = data;
        console.log( this.tempRepozitory);
      },
      error: (err:HttpErrorResponse) => console.error('load katalog err: --' + err.message)
    });
  }
}
