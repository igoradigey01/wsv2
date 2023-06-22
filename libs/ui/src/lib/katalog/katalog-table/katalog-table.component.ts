import { ChangeDetectionStrategy, Component ,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import { Nomenclature } from '@wsv2/app-common';


@Component({
  selector: 'wsv2-katalog-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './katalog-table.component.html',
  styleUrls: ['./katalog-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KatalogTableComponent {

  @Input() public flagOpt = false;
  @Input() public serverUrl = 'https://s.x-01.ru/';

  private _products =<Nomenclature[]>[];
  @Input()
  set products(value: Nomenclature[]) {
    this._products = value;
    this.productItems.set(this._products);

    //console.log(value);
  }
  public productItems = signal(this._products);

  @Output() public _onSelectedProduct = new EventEmitter<Nomenclature>();


  public changeProduct(item: Nomenclature) {
    this._onSelectedProduct.emit(item);

  }
  public ImgObj(item: Nomenclature): string {

    return `${this.serverUrl}images/S${item.guid}.webp`
  }


}
