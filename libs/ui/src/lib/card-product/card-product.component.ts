import {
  Component,
  ChangeDetectionStrategy,
  signal,
 
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Clipboard } from '@angular/cdk/clipboard';
import { Input, Output, EventEmitter } from '@angular/core';
import { Nomenclature } from '@wsv2/app-common';
import {ImageSliderComponent} from '../image-slider/image-slider.component'
import { ISliderImage } from '@wsv2/app-common';

@Component({
  selector: 'wsv2-card-product',
  standalone: true,
  imports: [
    CommonModule,
    ClipboardModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    ImageSliderComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
})
export class CardProductComponent {

  private _product = <Nomenclature>{
    id: -1,
    guid: '',
    name: '',
    description: '',
    price: -1,
    markup: -1,
    cost_total: -1,
    inStock: false,
    katalogId: -1,
    katalogName: '',
    colorName: '',
    brandName: '',
    articleName: '',
    postavchik: '',
  };

  @Input()  public katalog_name: string | undefined;
  // _product =signal<Nomenclature ,undefined>(undefined);

  @Input()
  set product(value: Nomenclature) {
    this._product = value;
    this.productItem.set(this._product);

    //console.log(value);
  }

  @Input() public flagOpt = false;

  @Input() public serverUrl = '';

  @Input() public productURL: string | undefined;
  @Input() public katalogURL: string | undefined;

  @Output() public _onBack = new EventEmitter();
  @Output() public addCart = new EventEmitter<Nomenclature>();

  public productItem = signal(this._product);

  public get ImgUrls():ISliderImage[]{
    //return `${this.serverUrl}images/L${this.productItem().guid}.webp`;

    return [];
  }

  public get FullName(): string {
    // replace in new vertion db !!!

    //  console.log( )
    return (
      this.productItem().name +
      ' ' +
      this.productItem().brandName +
      ' ' +
      this.productItem().articleName +
      ' ' +
      this.productItem().colorName
    );
  }

  constructor(private clipboard: Clipboard) //private cd: ChangeDetectorRef
  {}

  // public ngOnChanges(changes: SimpleChanges) {
  // //  this.productItem.set(this._product);

  // }

  public copyLinkP() {
    if (this.productURL) this.clipboard.copy(this.productURL);
  }

  public copyLinkK() {
    if (this.katalogURL) this.clipboard.copy(this.katalogURL);
  }

  public ImgObj(): string {
    //const guid = this.product?.guid ? this.product.guid : '';
    //const url=single(this.product?.guid)

    return `${this.serverUrl}images/L${this.productItem().guid}.webp`;
  }

  public on_back() {
    this._onBack.emit();
  }

  public add_cart(){
    this.addCart.emit(this.productItem());

  }
}
