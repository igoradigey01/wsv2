import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { StateView } from '@wsv2/app-common';
import { SubKatalog, Katalog, Product } from '@wsv2/app-common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { KatalogComponent } from '@wsv2/ui';
import { ProductItemComponent } from './product-item.component';

import { ProductSidenavComponent } from './product-sidenav.component';
import { ProductService } from '@wsv2/shop-content';

export enum StateView {
  default = 0, // sidenav
  listView = 2,

  edit = 4,
  create = 5,
  delete = 7,
}

export interface EmitData {
  catalogId: number;
  subCatalogId: number;
  product: Product;
  stateView: StateView;
}

@Component({
  selector: 'wsv2-product-shell',
  standalone: true,
  imports: [
    CommonModule,
    ProductItemComponent,    
    ProductSidenavComponent,
    KatalogComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product-shell.component.html',
  styleUrls: ['./product-shell.component.scss'],
})
export class ProductShellComponent {
  public flag = StateView.default;
  public emitData = <EmitData>{
    catalogId: 0,
    subCatalogId: 0,
    stateView: StateView.default,
  };

  public readonly catalogs = this.repositoryProduct.Catalogs;
  public readonly subCatalogs = this.repositoryProduct.SubCatalogs;

  public readonly Articles=this.repositoryProduct.Articles;
  public readonly Colors= this.repositoryProduct.Colors;
  public readonly Brands=this.repositoryProduct.Brands

  /* computed(() => this.repositoryProduct.SubCatalogs() 
  .filter((f) => f.catalogId === this.emitData.catalogId)  
  ); */

  public readonly message = this.repositoryProduct.Message;

  public subCatalog = <SubKatalog>{
    id: 0,
    name: 'none',
    ownerId: 'none',
    catalogId: 0,
    GoogleTypeId: '',
    decriptSeo: '',
    hidden: false,
  };
  public catalog= <Katalog>{
    id: 0,
    name: 'none',
    ownerId: 'none',
    hidden: true,
    decriptSeo: '',
  };
public  item =
  <Product>{
    id: -1,
    guid: '',
   img_guids:undefined,
    hidden:false,
    ownerId:'',
    product_typeId:-1,
    title: '',

    subCatalogId:-1,
    subCatalogName:undefined,

    colorId: -1,
    colorName: undefined,
    brandId: -1,
    brandName: undefined,
    articleId: -1,
    articleName: undefined,

    position: 0,
    inStock:false,  //есть  на складе ?
    sale:false,
  
   
    price: -1,
    markup: 25,
    cost_total:undefined, 
    description: undefined,
    descriptionSeo:undefined,
    imageWebp:undefined,
    wwwroot:undefined,
    wwwrootOK:undefined
   
  };

  constructor(private repositoryProduct: ProductService) {
    repositoryProduct.ClearMessage();
    // console.log( "constructor product-shell"+  JSON.stringify(repositoryProduct.SubCatalogs))
  }

  public onSubCatalogChange(event: EmitData) {
    //debugger
    this.emitData = event;
    this.flag = StateView.listView;
  }

  public backToCatalog() {
    this.flag = StateView.default;
  }
}
