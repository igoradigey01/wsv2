import { Component, computed, Signal, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule } from '@angular/forms';
import { ProductService } from '@wsv2/shop-content';
import { Product, ProductType } from '@wsv2/app-common';

import { Color } from '@wsv2/app-common';
import { Brand } from '@wsv2/app-common';
import { Article } from '@wsv2/app-common';
import { EmitData, StateView } from './product-shell.component';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ImgRenderComponent } from '@wsv2/ui';

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
    NgIf,
    NgFor,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,

    FormsModule,
    ImgRenderComponent,
  ],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {
  private state = signal<Product>(<Product>{
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
    wwwrootOK: undefined,
  });

  private _flag = StateView.default;

  private _product_type_id = signal<number>(0);
  private _articls: Signal<Article[]> = signal<Article[]>([]);
  private _colors: Signal<Color[]> = signal<Color[]>([]);
  private _brands: Signal<Brand[]> = signal<Brand[]>([]);

  public Product = computed(() => this.state());
  public ProductTypeId = computed(() => this._product_type_id);
  public ArticleItmes = computed(() => this._articls());
  public ColorItmes = computed(() => this._colors());

  public BrandItmes = computed(() => this._brands());

  //@Input() public _select_Nomenclature: Product;
  @Input({ required: true }) public set Articles(items: Signal<Article[]>) {
    if (items) {
      this._articls = items;
    }
  }
  @Input({ required: true }) public set Brands(items: Signal<Article[]>) {
    this._brands = items;
  }
  @Input({ required: true }) public set Colors(items: Signal<Article[]>) {
    this._colors = items;
  }

  @Input({ required: true }) set product_type_id(item: Signal<number>) {
    this._product_type_id.set(item());
  }

  @Input({ required: true }) set Item(item: Product) {
    this.state.update(() => ({
      ...item,
      brandName: this.BrandItmes().find((d) => d.id === item.brandId)?.name,
      colorName: this.ColorItmes().find((d) => d.id === item.colorId)?.name,
      articleName: this.ArticleItmes().find((d) => d.id === item.articleId)
        ?.name,
    }));
  }

  @Input({ required: true }) set flag(stateView: StateView) {
    this._flag = stateView;
  }

  @Output() public _onChangeStateView = new EventEmitter<StateView>();
  @Output() public ProductModified = new EventEmitter<EmitData>();

  @ViewChild(ImgRenderComponent, { static: false })
  private _childComponent: ImgRenderComponent | undefined;

  public _flagInvalid = false;

  public _selectDtoImg: DtoImage = <DtoImage>{
    blobUriImg: '',
    flagChanged: false,
  };
  public _flagButtonShow = false;
  public _flagError = false;
  _errorMgs: string[] = []; // обработка фото

  public get IsCreateView(): boolean {
    return this._flag == StateView.create ? true : false;
  }

  constructor(
    private _repository: ProductService
  ) // private _imgManager: ImgManagerService
  {}

  public onBrandChange(event: any) {
    this.state.update((state) => ({
      ...state,
      brandName: this.BrandItmes().find((d) => d.id === this.state().brandId)
        ?.name,
    }));
  }

  public onColorChange(event: any) {
    this.state.update((state) => ({
      ...state,
      colorName: this.ColorItmes().find((d) => d.id === this.state().colorId)
        ?.name,
    }));
  }

  public onArticleChange(event: any) {
    this.state.update((state) => ({
      ...state,
      articleName: this.ArticleItmes().find(
        (d) => d.id === this.state().articleId
      )?.name,
    }));
  }

  public onChangedDtoImage(event: DtoImage): void {
    this._selectDtoImg = event; // прередача  фото  из дочернего компонента   <wsv2-img-render>
  }

  public onFlagButtonPanel(event: boolean): void {
    //  debugger
    this._flagButtonShow = !event;
  }
  /**     Изменить  Фото  товара */
  public saveOnlyImgFromProduct(): void {
    this._childComponent?.getDtoImgObgect();

    this._errorMgs = [];
    if (!this._selectDtoImg.flagChanged) {
      this._errorMgs.push('Файл Фото не изменился');
      this._flagInvalid = true;
    }

    if (
      this._flag == StateView.edit ||
      this._flag === StateView.editOnlyImage
    ) {
      this._flagInvalid = true;
      this._errorMgs.push(' flag  StateView.edit != Edit');
    }

    this.state.update((state) => ({
      ...state,
      imageWebp: this._selectDtoImg.blobUriImg,
    }));

    this.ProductModified.emit(<EmitData>{
      product: this.Product(),
      stateView: StateView.editOnlyImage,
    });
  }

  /** save only  property Product igonore <File> Blob */
  public saveIgnoreImgFromProduct(): void {
    this._errorMgs = [];

    if (this._flag == StateView.edit) {
      this._flagInvalid = true;
      this._errorMgs.push(' flag  StateView.edit != Edit');
    }

    this.ProductModified.emit(<EmitData>{
      product: this.Product(),
      stateView: StateView.editOnlyProduct,
    });
  }

  /** Create  or Update all */
  public saveProduct(): void {
    this._errorMgs = [];

    /** -----init _selectDtoImg  get blob img from ImgRenderComponen---- */
    this._childComponent?.getDtoImgObgect();

    /**  'Файл Фото не изменился,' */
    if (!this._selectDtoImg.flagChanged) {
      this.saveIgnoreImgFromProduct();
      return;
    }

    this.state.update((state) => ({
      ...state,
      imageWebp: this._selectDtoImg.blobUriImg,
    }));

    this.ProductModified.emit(<EmitData>{
      product: this.Product(),
      stateView: this._flag,
    });
  }

  public deleteProduct() {
    this.ProductModified.emit(<EmitData>{
      product: this.Product(),
      stateView: StateView.delete,
    });
  }
  public onBackInKatalog() {
    this._onChangeStateView.emit(StateView.default);
  }

  public cancel() {
    // debugger
    this._onChangeStateView.emit(StateView.default);
  }
}
