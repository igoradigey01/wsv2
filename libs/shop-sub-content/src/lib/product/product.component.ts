import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ProductService } from '../_shared/services/product.service';
import { StateView, Product, } from '@wsv2/app-common';
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

  products = this._repository.Products;

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
  serverUrl = this._repository.serverUrl;
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
    private _repository: ProductService,
    private routeActvate: ActivatedRoute,

  ) {
    // debugger
    this._subKatalogProductsUrl = window.location.href;

    const idProduct  = this.routeActvate.snapshot.queryParams['productId'];
    routeActvate.params.subscribe((params) => (this.idSubKatatlog = params['id']));

    if (this.idSubKatatlog) {
      _repository.PoductsSet(this.idSubKatatlog)
    }
    this.ShowChangeProduct(idProduct);

   

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
    throw console.error("not implement addCart click");

  }



  public onBackInNavBar() {
    // //console.log(" onBackInNavBar")
    //  if(this.sharedVar.IdCategoria!==-1)
    // this.router.navigateByUrl('/content/categoria/'+this.sharedVar.IdCategoria);
    // else{
    //   if(this._nomenclatures.length>0)
    //   this.repository.KatalogN(this._nomenclatures[0].katalogId).subscribe(
    //     d=>{

    //       this.router.navigateByUrl('/content/categoria/'+d.categoriaId);

    //     }
    //   )






  }

  private ShowChangeProduct(idProduct:string){
   // debugger
    if(idProduct){
      this._subKatalogProductItemUrl='';
    this._repository.PoductsItemSet(idProduct);
    this.itemProduct=this._repository.ProductItem;
   this._subKatalogProductItemUrl=this._subKatalogProductsUrl;

      this.flagViewState=StateView.itemView;
    }
    
  }

}
