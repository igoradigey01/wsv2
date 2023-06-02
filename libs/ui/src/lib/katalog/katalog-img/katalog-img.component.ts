import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Input, Output, EventEmitter } from '@angular/core';
import { Nomenclature } from '@wsv2/shop-cart';

@Component({
  selector: 'wsv2-katalog-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './katalog-img.component.html',
  styleUrls: ['./katalog-img.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KatalogImgComponent {
   
  @Input() public flagView = false;
  @Input() public flagOpt = false;
  @Input() public serverUrl = 'https://s.x-01.ru/';
  @Input() public pageTitle = 'Каталог';
  @Input() public errorMessage = '';
  @Input() public products =<Nomenclature[]>[];

  @Output() public onSelectedProduct = new EventEmitter<Nomenclature>();

  public changeProduct(item: Nomenclature) {
    this.onSelectedProduct.emit(item);

  }

  public ImgObj(item: Nomenclature): string {

    return `${this.serverUrl}images/S${item.guid}.webp`
  }



}
