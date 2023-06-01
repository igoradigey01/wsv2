import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nomenclature } from '@wsv2/shop-cart';

@Component({
  selector: 'wsv2-katalog-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './katalog-img.component.html',
  styleUrls: ['./katalog-img.component.scss'],
})
export class KatalogImgComponent {

  flagView =false;
  flagOpt=false;
  serverUrl='https://s.x-01.ru/';

  public changeProduct(item:Nomenclature){

  }

  public ImgObj(item:Nomenclature):string{ 
    
return `${this.serverUrl}images/S${item.guid}.webp`
}

  

}
