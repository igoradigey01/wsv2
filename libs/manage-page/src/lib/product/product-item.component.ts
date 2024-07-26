import { Component ,computed,Signal,signal,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf ,NgFor} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

import { FormsModule } from '@angular/forms';
import { ProductService } from '@wsv2/shop-content';
import { Product, ProductType} from '@wsv2/app-common';

import { Color } from '@wsv2/app-common';
import { Brand } from '@wsv2/app-common';
import { Article } from '@wsv2/app-common';
import { EmitData, StateView } from './product-shell.component';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ImgRenderComponent } from '@wsv2/ui'

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ImgManagerService } from '@wsv2/ui';

import { Input, Output, EventEmitter } from '@angular/core';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DtoImage } from '@wsv2/ui';


//mport { HttpEvent, HttpEventType } from '@angular/common/http';

//import { HttpErrorResponse } from '@angular/common/http';

export interface DtoNomenclature {
  nomenclature: Product;
  flagViewState: StateView;
}

@Component({
  selector: 'wsv2-product-item',
  standalone: true,
  imports: [
    CommonModule,
    NgIf ,NgFor,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,

    FormsModule,
   ImgRenderComponent
  ],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent   {

  private state = signal<Product>( <Product>{
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
   
  });

  private _flag = StateView.default
  
 

  private _product_typeIds:Signal< ProductType[]>=signal<ProductType[]>([]);
  private _articls:Signal<Article[]>=signal<Article[]>([]);
  private _colors:Signal<Color[]>=signal<Color[]>([]);
  private _brands:Signal<Brand[]>=signal<Brand[]>([]);

  public Product= computed(() => this.state());
  public ProductTypes=computed(()=>this._product_typeIds());
  public ArticleItmes=computed(()=>this._articls());
  public ColorItmes=computed(()=>this._colors());

  public BrandItmes=computed(()=>this._brands());



  
  //@Input() public _select_Nomenclature: Product;
  @Input({required:true}) public  set  Articles (items:  Signal<  Article[]>){
     this._articls=items;
    
  }
  @Input({required:true}) public  set Brands(items:  Signal<  Article[]>){
    this._brands=items;
   
 }
  @Input({required:true})  public  set Colors(items:  Signal<  Article[]>){
    this._colors=items;
   
 }

  

  @Input({required:true}) set Item(item: Product) {
  
 
    this.state.update(() =>{ 
      /* console.log("color ------- product-item")
        console.log(JSON.stringify(this.Brands))
        console.log(JSON.stringify(this.Colors))
       */
       item.brandName = this.BrandItmes().find(
        (d) => d.id === item.brandId
      )?.name;

      item.colorName = this.ColorItmes().find(
        (d) => d.id ===item.colorId
      )?.name;

      item.articleName = this.ArticleItmes().find(
        (d) => d.id ===item.articleId
      )?.name;

      return item;
  
    }
  );
  }

  @Input({ required: true }) set flag(stateView: StateView) {
    this._flag = stateView;
  }




  


  @Output() public _onChangeStateView = new EventEmitter<StateView>();
  @Output() public ProductModified = new EventEmitter<EmitData>();


  @ViewChild(ImgRenderComponent, { static: false })
  private _childComponent: ImgRenderComponent | undefined;

  public _flag_sendServerData= false;
  

  public _flagInvalid= false;

  public _progress = 0;

  public _selectDtoImg: DtoImage = <DtoImage>{
    base64Img: '',
    flagChanged: false,
  };
  public _flagButtonShow = false;
  public _flagError = false;
  _errorMgs: string[] = [];

  public _showPrefix = true;

  public get IsCreateView(): boolean {
    return this._flag == StateView.create ? true : false;
  }



  constructor(
    private _repository: ProductService,
    private _imgManager: ImgManagerService
  ) {
    //this._select_Nomenclature =
  }

  /* ngOnInit(): void {
     //debugger
    if (this._select_katalogN) {
      this._select_Nomenclature.katalogId = this._select_katalogN.id;
      this._select_Nomenclature.katalogName = this._select_katalogN.name;
    }
  } */

  public onBrandChange(event: any) {
    //debugger
    //console.log('Book changed...');
  /*   const selectedIdBrand = +event.value;

    this._select_Nomenclature.brandName = this._brands.find(
      (d) => d.id === this._select_Nomenclature.brandId
    )?.name; */

    

    this.state.update((state) => ({
      ...state,
      brandName : this.BrandItmes().find(
        (d) => d.id === this.state().brandId
      )?.name
    }));

  }

  public onColorChange(event: any) {

    this.state.update((state) => ({
      ...state,
      colorName : this.ColorItmes().find(
        (d) => d.id === this.state().colorId
      )?.name
    }));    
  }

  public onArticleChange(event: any) {


    this.state.update((state) => ({
      ...state,
      articleName : this.ArticleItmes().find(
        (d) => d.id === this.state().articleId
      )?.name
    }));    

  }

  public onChangedDtoImage(event: DtoImage): void {
    this._selectDtoImg = event;
  }

  public onFlagButtonPanel(event: boolean): void {
   //  debugger
    this._flagButtonShow = !event;
  }

   public saveOnlyImgFromProduct(): void {

    //debugger
    this._childComponent?.getDtoImgObgect();
    this._errorMgs = [];
    if (
      !this._selectDtoImg.flagChanged 
    ) {
      this._errorMgs.push('Файл Фото не изменился');
      this._flagInvalid = true;
    
    }

    if(this._flag == StateView.edit){
      this._flagInvalid = true;
      this._errorMgs.push(' flag  StateView.edit != Edit');
     
    
    }

   

    if (this._imgManager.FlagError) {
      this._errorMgs.push(this._imgManager.ErrorMassages);
      //   this._flagInvalid = true;
      return;
    }

    

    this.state.update((state) => ({
      ...state,
      imageWebp: this._imgManager.convererFromImgBase64Url(this._selectDtoImg.base64Img)
    }));    

    this.ProductModified.emit(<EmitData>{
      product: this.Product(),
       stateView: this._flag,
     });
 
     

   /*  if (this._flagViewMode == StateView.edit) {
      // ---- start edit -------
      this._repository.UpdateOnlyImg(this._select_Nomenclature).subscribe(
        (data: HttpEvent<any>) => {
          //progress bar
          switch (data.type) {
            case HttpEventType.Sent:
              console.log('Sent-- запрос отправлен--UpdateProduct--'); // запрос отправлен
              break;
            case HttpEventType.UploadProgress:
              // do something
              if (data.total) {
                this._progress = Math.round((100 * data.loaded) / data.total);
                console.log('HttpEventType.UploadProgress--' + this._progress);
              }
              break;
            case HttpEventType.Response:
              console.log('---Finished-----');
              this._errorMgs = [];
              this._flagError = false;
              //03.02.22
              this._select_Nomenclature.wwwrootOK = true;
              this._onNomenclatureChange.emit(<DtoNomenclature>{
                nomenclature: this._select_Nomenclature,
                flagViewState: this._flagViewMode,
              });
              //   window.location.replace(this._select_Product.rootImgSrc+'S'+this._select_Product.imgName+'.web');

              this.cancel(); //15.03.21
              break;
          }
          // end progrss bar
        },
        (err: HttpErrorResponse) => {
          this._flagError = true;
          //--  this._flag_sendServerData = false;
          this._flagInvalid = false;

          if (err.status === 401) {
            this._errorMgs.push('пользователь не авторизован,войдите на сайт');
            return;
          }
          if (err.status == 400) {
            console.log(err.error);
            if (err.error.errors) this._errorMgs.push(err.error.errors);
            else this._errorMgs.push(err.error);
            return;
          }

          this._errorMgs.push(
            'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса'
          );
        }
      );
      return;
      //--- end edit ---
    } */
  }


  /** save only  property Product igonore <File> Blob */
  public saveIgnoreImgFromProduct(): void {

    this._errorMgs = [];
    if (this.Product().subCatalogId == -1) {
      this._flagInvalid = true;
      this._errorMgs.push('Каталог не задан');
     
    }

/* if(this._flagViewMode == StateView.edit){
  this._flagInvalid = true;
  this._errorMgs.push(' flag  StateView.edit != Edit');
 

}
 */
    if (this._imgManager.FlagError) {
      this._errorMgs.push(this._imgManager.ErrorMassages);
      //   this._flagInvalid = true;
      return;
    }

    this.ProductModified.emit(<EmitData>{
      product: this.Product(),
       stateView: this._flag,
     });
 

   /*  if (this._flagViewMode == StateView.edit) {
      // ---- start edit -------
      this._repository.UpdateIgnoreImg(this._select_Nomenclature).subscribe(
        (data: HttpEvent<any>) => {
          //progress bar
          switch (data.type) {
            case HttpEventType.Sent:
              console.log(
                'Sent-- запрос отправлен--saveIgnoreImgFromProduct--'
              ); // запрос отправлен
              break;
            case HttpEventType.UploadProgress:
              // do something
              if (data.total) {
                this._progress = Math.round((100 * data.loaded) / data.total);
                console.log('HttpEventType.UploadProgress--' + this._progress);
              }
              break;
            case HttpEventType.Response:
              console.log('---Finished-----');
              this._errorMgs = [];
              this._flagError = false;
              //03.02.22

              this._onNomenclatureChange.emit(<DtoNomenclature>{
                nomenclature: this._select_Nomenclature,
                flagViewState: this._flagViewMode,
              });
              this.cancel(); //15.03.21
              break;
          }
          // end progrss bar
        },
        (err: HttpErrorResponse) => {
          this._flagError = true;
          //--  this._flag_sendServerData = false;
          this._flagInvalid = false;
          if (err.status === 401) {
            this._errorMgs.push('пользователь не авторизован,войдите на сайт');
            return;
          }
          if (err.status == 400) {
            console.log(err.error);
            if (err.error.errors) this._errorMgs.push(err.error.errors);
            else this._errorMgs.push(err.error);
            return;
          }

          this._errorMgs.push(
            'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса'
          );
        }
      );
      return;
      //--- end edit ---
    } */
  }

  /** Create  or Update all */
  public saveNomenclature(): void {

    /* this._flagInvalid = true;
    this._flag_sendServerData = true; */
    // debugger
    

    this._errorMgs = [];
    if (this.Product().subCatalogId == -1) {
      this._flagInvalid = true;
      this._errorMgs.push('Каталог не задан');
     
    }
    if (this._imgManager.FlagError) {
      this._errorMgs.push(this._imgManager.ErrorMassages);
      //   this._flagInvalid = true;
      return;
    }

    /** -----init _selectDtoImg  get blob img from ImgRenderComponen---- */
    this._childComponent?.getDtoImgObgect();

    /**  'Файл Фото не изменился,' */
    if (
      !this._selectDtoImg.flagChanged 
    ) {
      this.saveIgnoreImgFromProduct();
      return;
    }

    this.state.update((state) => ({
      ...state,
      imageWebp: this._imgManager.convererFromImgBase64Url(this._selectDtoImg.base64Img)
    }));    

    this.ProductModified.emit(<EmitData>{
      product: this.Product(),
       stateView: this._flag,
     });
 

    /* if (this._imgManager.FlagError) {
      this._errorMgs.push(this._imgManager.ErrorMassages);
      //   this._flagInvalid = true;
      return;
    } */
    //   throw new  Error("Not impliment exeption!")
    //  debugger;
   /*  if (this._flagViewMode == StateView.create) {
      // --- start create--
      this._repository.Create(this._select_Nomenclature).subscribe(
        (data: HttpEvent<any>) => {
          //progress bar
          switch (data.type) {
            case HttpEventType.Sent:
              //  console.log('Sent-- запрос отправлен--UpdateProduct--'); // запрос отправлен
              break;
            case HttpEventType.UploadProgress:
              // do something
              if (data.total) {
                this._progress = Math.round((100 * data.loaded) / data.total);
                //   console.log('HttpEventType.UploadProgress--' + this._progress);
              }
              break;
            case HttpEventType.Response:
              //  console.log('---Finished-----');
              this._errorMgs = [];
              this._flagError = false;

              this._select_Nomenclature.guid = data.body.guid; // on server imgName ==Image
              this._select_Nomenclature.id=data.body.id;
              this._select_Nomenclature.wwwroot=this._repository.WWWroot;

              this._onNomenclatureChange.emit(<DtoNomenclature>{
                nomenclature: this._select_Nomenclature, //,
                flagViewState: this._flagViewMode,
              });

              this.cancel(); //15.03.21
              break;
          }
          // end progrss bar
        },
        (err: HttpErrorResponse) => {
          this._flagError = true;
          //--  this._flag_sendServerData = false;
          this._flagInvalid = false;
          if (err.status === 401) {
            this._errorMgs.push('пользователь не авторизован,войдите на сайт');
            return;
          }
          if (err.status == 400) {
            console.log(err.error);
            if (err.error.errors) this._errorMgs.push(err.error.errors);
            else this._errorMgs.push(err.error);
            return;
          }

          this._errorMgs.push(
            'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса'
          );
        }
      );

      return;
      //--- end create -------
    }
    if (this._flagViewMode == StateView.edit) {
      // ---- start edit -------
      this._repository.UpdateAll(this._select_Nomenclature).subscribe(
        (data: HttpEvent<any>) => {
          //progress bar
          switch (data.type) {
            case HttpEventType.Sent:
              console.log('Sent-- запрос отправлен--UpdateProduct--'); // запрос отправлен
              break;
            case HttpEventType.UploadProgress:
              // do something
              if (data.total) {
                this._progress = Math.round((100 * data.loaded) / data.total);
                console.log('HttpEventType.UploadProgress--' + this._progress);
              }
              break;
            case HttpEventType.Response:
              console.log('---Finished-----');
              this._errorMgs = [];
              this._flagError = false;
              //03.02.22
              this._select_Nomenclature.wwwrootOK = true;
              this._onNomenclatureChange.emit(<DtoNomenclature>{
                nomenclature: this._select_Nomenclature,
                flagViewState: this._flagViewMode,
              });
              //   window.location.replace(this._select_Product.rootImgSrc+'S'+this._select_Product.imgName+'.web');

              this.cancel(); //15.03.21
              break;
          }
          // end progrss bar
        },
        (err: HttpErrorResponse) => {
          this._flagError = true;
          //--  this._flag_sendServerData = false;
          this._flagInvalid = false;

          if (err.status === 401) {
            this._errorMgs.push('пользователь не авторизован,войдите на сайт');
            return;
          }
          if (err.status == 400) {
            console.log(err.error);
            if (err.error.errors) this._errorMgs.push(err.error.errors);
            else this._errorMgs.push(err.error);
            return;
          }

          this._errorMgs.push(
            'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса'
          );
        }
      );
      return;
      //--- end edit ---
    } */

    // this._flagInvalid = true; //!!!!
  }

  public deleteNomenclature() {
   /*  this._flagInvalid = true;
    this._flag_sendServerData = true;
    // debugger
    this._errorMgs = [];
    this._flagError = false; */
    this._flag=StateView.delete;

    this.state.update((state) => ({
      ...state,
      imageWebp: this._imgManager.convererFromImgBase64Url(this._selectDtoImg.base64Img)
    }));    

    this.ProductModified.emit(<EmitData>{
      product: this.Product(),
       stateView: this._flag,
     });
 
/* 
    this._repository.Delete(this._select_Nomenclature.id).subscribe(
      (data: HttpEvent<any>) => {
        //progress bar
        switch (data.type) {
          case HttpEventType.Sent:
            console.log('Sent-- запрос отправлен--UpdateProduct--'); // запрос отправлен
            break;

          case HttpEventType.Response:
            console.log('---Finished-----');

            this._onNomenclatureChange.emit(<DtoNomenclature>{
              nomenclature: this._select_Nomenclature,
              flagViewState: StateView.delete,
            });

            this.cancel(); //15.03.21
            break;
        }
        // end progrss bar
      },
      (err: HttpErrorResponse) => {
        // debugger

        this._flagError = true;
        //--  this._flag_sendServerData = false;
        this._flagInvalid = false;
        if (err.status === 401) {
          this._errorMgs.push('пользователь не авторизован,войдите на сайт');
          return;
        }

        if (err.status == 400) {
          console.log(err.error);
          if (err.error.errors) this._errorMgs.push(err.error.errors);
          else this._errorMgs.push(err.error);
          return;
        }

        this._errorMgs.push(
          'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса'
        );
      }
    );

    return; */
  }
  public onBackInKatalog() {
    this._onChangeStateView.emit(StateView.default);
  }

  public cancel() {
    // debugger
    this._onChangeStateView.emit(StateView.default);
  }

  public undo() {
    //debugger
    this._flag_sendServerData = false;
  }

  public OK() {
    this._onChangeStateView.emit(StateView.default);
  }
}

