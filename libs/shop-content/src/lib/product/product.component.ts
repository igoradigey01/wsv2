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
      id: 0,
      guid: undefined,
      img_guids: undefined,
      hidden: false,
      ownerId: '',
      product_typeId: 0,
      title: '',
      subCatalogId: 0,
      subCatalogName:undefined,

      colorId: 0,
      colorName:undefined,
      brandId: 0,
      brandName:undefined,
      articleId: 0,
      articleName:undefined,
      

      position: 0,
      inStock: false,
      sale: false,
      price: 0,
      markup: 0,
      cost_total: undefined,
      description: undefined,
      
      descriptionSeo:undefined

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
     // _repositoryProduct.PoductsSet(this.idSubKatatlog)//17.03.25
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
  //  this._repositoryProduct.PoductsItemSet(idProduct);//17.03.25
   // this.itemProduct=this._repositoryProduct.ProductItem; //17.03.25
   this._subKatalogProductItemUrl=this._subKatalogProductsUrl;

      this.flagViewState=StateView.itemView;
    }
    
  }

}
