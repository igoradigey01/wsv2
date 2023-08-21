import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ProductService } from '../_shared/services/product.service';
import { StateView, Product, } from '@wsv2/app-common';
import {CartService } from '@wsv2/shop-cart'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { KatalogImgComponent, CardProductComponent } from '@wsv2/ui';


@Component({
  selector: 'wsv2-product',
  standalone: true,
  imports: [CommonModule, KatalogImgComponent, CardProductComponent],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {

  products = this._repositoryProduct.Products;

  itemProduct =
    signal<Product>({
      id: -1, name: '', price: -1, katalogId: -1,
      colorId: -1, brandid: -1, hidden: false, guid: undefined, img_guids: undefined,
      description: undefined, sale: undefined, brandName: undefined, colorName: undefined,
      articleId: -1, articleName: undefined, postavchik: undefined, markup: undefined,
      cost_total: undefined, inStock: undefined, katalogName: undefined
    });

  idSubKatatlog: string | undefined;
  subkatalog_name = '';
  pageTitle = this.subkatalog_name;
  flagViewState: StateView = StateView.default;
  serverUrl = this._repositoryProduct.serverUrl;
  private _subKatalogProductsUrl: string;
  private _subKatalogProductItemUrl='';



  public get UrlProduct(): string {

    return  this._subKatalogProductItemUrl;
  }

  public get UrlKatalogProducts(): string {
    // throw console.error("not implement UrlKatalog()")
    return this._subKatalogProductsUrl;

  }

  constructor(
    private _repositoryProduct: ProductService,
    private _repositoryCart:CartService,
    private routeActvate: ActivatedRoute,
    private router: Router

  ) {
    // debugger
    this._subKatalogProductsUrl = window.location.href;

    const idProduct  = this.routeActvate.snapshot.queryParams['productId'];
    this.ShowChangeProduct(idProduct);
    routeActvate.params.subscribe((params) => (this.idSubKatatlog = params['id']));

    if (this.idSubKatatlog) {
      _repositoryProduct.PoductsSet(this.idSubKatatlog)
    }
   

   

  }


  public changeProduct(item: Product): void {
    // debugger
    this.itemProduct.set(item);
    this._subKatalogProductItemUrl=this._subKatalogProductsUrl  + "?productId=" + this.itemProduct().id;

    this.flagViewState = StateView.itemView;


  }

  public changeViewState(viewState: number) {
    // debugger
    this.flagViewState = viewState;


  }
  public _onQRCode() {
    throw console.error("not implement _onQRCode click");

  }

  public addCart(item: Product) {
    //throw console.error("not implement addCart click");
    this._repositoryCart.addToCart(item);

  }



  public onBackInNavBar() {
    //debugger
    //this.router.navigate(['/index/katalogs',this.products()[0].katalogId]);

    const url=this._subKatalogProductsUrl;
   const arr=url.split("/",6).slice(-3)
   const new_url= arr.join('/')
  // console.log(JSON.stringify(arr))
   this.router.navigate([new_url]);

  }

  private ShowChangeProduct(idProduct:string){
   // debugger
    if(idProduct){
      this._subKatalogProductItemUrl='';
    this._repositoryProduct.PoductsItemSet(idProduct);
    this.itemProduct=this._repositoryProduct.ProductItem;
   this._subKatalogProductItemUrl=this._subKatalogProductsUrl;

      this.flagViewState=StateView.itemView;
    }
    
  }

}
