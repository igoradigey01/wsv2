import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KatalogComponent, IButton } from '@wsv2/ui'

@Component({
  selector: 'wsv2-index-shop',
  standalone: true,
  imports: [
    CommonModule,
    KatalogComponent,
  
  ],
  templateUrl: './index-shop.component.html',
  styleUrls: ['./index-shop.component.scss'],
})
export class IndexShopComponent {

  tempRepozitory:IButton[]=[
    <IButton>{id:1,name:"каталог-1"},
    <IButton>{id:2,name:"каталог-2"},
    <IButton>{id:3,name:"каталог-3"},
    <IButton>{id:4,name:"каталог-4"},
    <IButton>{id:5,name:"каталог-5"},
    <IButton>{id:6,name:"каталог-6"},
    <IButton>{id:7,name:"каталог-7"},
    <IButton>{id:8,name:"каталог-8"},
    <IButton>{id:9,name:"каталог-9"},
    <IButton>{id:10,name:"каталог-10"},
    <IButton>{id:11,name:"каталог-11"},
   ]
}
