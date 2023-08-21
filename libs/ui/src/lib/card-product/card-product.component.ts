import {
  Component,
  ChangeDetectionStrategy, 
  signal,

} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Clipboard } from '@angular/cdk/clipboard';
import { Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@wsv2/app-common';
import { ImageSliderComponent } from '../image-slider/image-slider.component'
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
export class CardProductComponent  {

  private _product = <Product>{
    id: -1,
    guid: '',
    img_guids: <string[]>[],
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

  @Input() public katalog_name: string | undefined;
  // _product =signal<Nomenclature ,undefined>(undefined);

  @Input()
  set product(value: Product) {
    //debugger
    this._product = value;
    this.productItem.set(this._product);

    //console.log(value);
  }
  public productItem = signal(this._product);

  @Input() public flagOpt = false;

  @Input() public serverUrl = '';

  @Input() public productURL: string | undefined;
  @Input() public katalogURL: string | undefined;

  @Output() public _onBack = new EventEmitter();
  @Output() public _onQRCode = new EventEmitter();
  @Output() public addCart = new EventEmitter<Product>();
  

  

  public get ImgUrls(): ISliderImage[] {

    const img_urls: ISliderImage[] = [];
  // debugger
    const guis = this.productItem().img_guids;
    if (guis) {
      guis.map(d => { img_urls.push({ url: `${this.serverUrl}images/L${d}.webp`, title: '' }) });

    }
       
    return img_urls;
  }

  public get FullName(): string {
    let name='';
    let article:string|undefined;
    let color:string|undefined;
    let brand:string|undefined;
    name=this.productItem().name?this.productItem().name:'';
    if(this.productItem().articleName){
    article=this.productItem().articleName==='none'?'':this.productItem().articleName;
    }
    if(this.productItem().colorName)
    color=this.productItem().colorName==='none'?'':this.productItem().colorName;
    if(this.productItem().brandName)
    brand=this.productItem().brandName==='none'?'':this.productItem().brandName;

  //  console.log( )
    return name+" "+brand+" "+color+" "+article;
  
  }

  constructor(
    private clipboard: Clipboard,
  
    ) //private cd: ChangeDetectorRef
  { }


  

  public copyLinkP() {
    if (this.productURL) this.clipboard.copy(this.productURL);
  }

  public copyLinkK() {
    if (this.katalogURL) this.clipboard.copy(this.katalogURL);
  }

  // public ImgObj(): string {
  //   //const guid = this.product?.guid ? this.product.guid : '';
  //   //const url=single(this.product?.guid)

  //   return `${this.serverUrl}images/L${this.productItem().guid}.webp`;
  // }

  public on_back() {
    this._onBack.emit();
  }

  public on_qr_code() {
    this._onQRCode.emit();
  }

  public add_cart() {
    this.addCart.emit(this.productItem());

  }
}
