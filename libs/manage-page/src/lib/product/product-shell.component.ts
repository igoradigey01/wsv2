import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { StateView } from '@wsv2/app-common';
import { SubKatalog, Katalog, Product, ProductType, Message } from '@wsv2/app-common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { KatalogComponent } from '@wsv2/ui';
import { ProductItemComponent } from './product-item.component';

import { ProductSidenavComponent } from './product-sidenav.component';
import { ProductListComponent } from './product-list.component'

import { ProductService, ProductTypeService } from '@wsv2/shop-content';
import { ActivatedRoute } from '@angular/router';

export enum StateView {
  default = 0, // sidenav
  sendData=1,
  listView = 2,
  editOnlyProduct=3,
  editOnlyImage=6,
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
    ProductListComponent,
    ProductSidenavComponent,
    KatalogComponent,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-shell.component.html',
  styleUrls: ['./product-shell.component.scss'],
})
export class ProductShellComponent {

  private idSubCatalogAktive = -1;

  public flag = StateView.default;
  public emitData = <EmitData>{
    catalogId: 0,
    subCatalogId: 0,
    stateView: StateView.default,
  };


  public state_product_type_id=signal(0);

  public readonly  state_Error=   computed(() => { return this.repositoryProduct.Message() })                                  //signal<Message >({error:false,message:''})


  public readonly Catalogs = this.repositoryProduct.Catalogs;
  public readonly SubCatalogs = this.repositoryProduct.SubCatalogs;
  public readonly  Product_types = this.repositoryProductType.ProductTypes;

  public readonly Articles =   computed(() => { 
    
    return  this.repositoryProduct.Articles() .filter((f) => f.product_typeId ===  this.state_product_type_id())}); 
      
  public readonly Colors = computed(() => { 
    
    return  this.repositoryProduct.Colors() .filter((f) => f.product_typeId ===  this.state_product_type_id())}); 
      
  public readonly Brands = computed(() => { 
    
    return    this.repositoryProduct.Brands() .filter((f) => f.product_typeId ===  this.state_product_type_id())}); 
  


  public Products = computed(() => {

    this.repositoryProduct.LoadSubCatalogProduct(this.idSubCatalogAktive);

    return this.repositoryProduct.Products();


  });

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
  public catalog = <Katalog>{
    id: 0,
    name: 'none',
    ownerId: 'none',
    hidden: true,
    decriptSeo: '',
  };
  public item = <Product>{
    id: -1,
    guid: '',
    img_guids: undefined,
    hidden: false,
    ownerId: '',
    product_typeId: -1,
    title: '',

    subCatalogId: -1,
    subCatalogName: undefined,


    colorId: -1,
    colorName: undefined,
    brandId: -1,
    brandName: undefined,
    articleId: -1,
    articleName: undefined,


    

    position: 0,
    inStock: false, //есть  на складе ?
    sale: false,

    price: -1,
    markup: 25,
    cost_total: undefined,
    description: undefined,
    descriptionSeo: undefined,
    imageWebp: undefined,
    wwwroot: undefined,
  //  wwwrootOK: undefined,
  };

  constructor(
    private route: ActivatedRoute,
    private repositoryProduct: ProductService,
    private repositoryProductType: ProductTypeService
  ) {

    this.route.data.subscribe((v) => {
      const id=+v['type_product']
      this.state_product_type_id.set(id);
    //  this.selected_product_typeId=id;
      
     

    console.log( "constructor product-shell  -- 'type_product  id "+  JSON.stringify(id))
    }); 
    repositoryProduct.ClearMessage();
    // console.log( "constructor product-shell"+  JSON.stringify(repositoryProduct.SubCatalogs))
  }

  public onSubCatalogChange(event: EmitData) {
    //debugger
    this.emitData = event;
    this.flag = StateView.listView;
    this.idSubCatalogAktive = event.subCatalogId;
  }


  public onProductChange(event: EmitData) {
    if(event.stateView==StateView.create)
    {
    
    
     this.item.colorId  =  this.Colors().find((f)=>f.name==='none')?.id||-1;
     
    this.item.colorName="none";
     this.item.brandId= this.Brands().find((f)=>f.name==='none')?.id||-1;
     this.item.brandName="none";
     this.item.articleId=this.Articles().find((f)=>f.name==='none')?.id||-1;
     this.item.articleName="none";
     this.item.price=0;
     
      this.flag = event.stateView;

    }else{
    this.item = event.product;
    this.flag = event.stateView;
    }
    
  }

  public ProductModified(event: EmitData) {

   // debugger
    if (event.stateView === StateView.create) {
      event.product.ownerId=this.repositoryProduct.ownerId;
     event.product.subCatalogId=this.idSubCatalogAktive;
        
      //console.log ("ProductModified  product-shell Stateview.create :" +JSON.stringify(event.product))
      this.repositoryProduct.Create(event.product);
      this.flag = StateView.sendData;
    }
    if (event.stateView === StateView.edit) {
      this.repositoryProduct.UpdateAll(event.product);
      this.flag = StateView.sendData;
    }
    if(event.stateView===StateView.editOnlyImage){
      this.repositoryProduct.UpdateOnlyImg(event.product);
      this.flag = StateView.sendData;
    }
    if(event.stateView===StateView.editOnlyProduct){
      this.repositoryProduct.UpdateIgnoreImg(event.product);
      this.flag = StateView.sendData;
   }
    if (event.stateView === StateView.default) {
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.delete) {
      this.repositoryProduct.Delete(event.product);
      this.flag = StateView.default;
    }
  }

  

  public backToCatalog() {
    this.flag = StateView.default;
  }

  public backToList() {
    this.flag = StateView.listView;
  }
}
