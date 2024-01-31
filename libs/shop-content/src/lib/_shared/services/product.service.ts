import { Injectable, signal,computed } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ApiService } from '@wsv2/app-config';
import { Product, Article, Brand, Color, Status ,Message} from '@wsv2/app-common';
import { SubKatalogService } from './sub-katalog.service';
import {ArticleService} from './article.service'
import {BrandService} from './brand.service'
import {ColorService} from './color.service'
import {ProductTypeService} from './product_type.service'

import { catchError, of, tap, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


interface ProductListState {
  productItems: Product[];

  queryAdd:  Product[];
  queryUpdate:  Product[];
  queryDelete:  Product[];

  state: Status;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {



  private state = signal<ProductListState>({
    productItems: [],
    queryAdd: [],
    queryUpdate: [],
    queryDelete: [],
    state: Status.empty,
  });

  private error_state = signal<Message>({ message: undefined, error: false });

  readonly Articles = this.articleRepository.Articles
  readonly Brands = this.brandRepository.Brands
  readonly Colors = this.colorRepository.Colors

  readonly TypeProducts =this.product_typeRepository.ProductTypes;
 

 

  readonly   Products = computed(() => this.state().productItems);
  readonly Message = computed(() => this.error_state());



  ProductItem = signal<Product>({
    id: 0,
    guid: undefined,
    img_guids: undefined,
    hidden: false,
    ownerId: '',
    product_typeId: 0,
    title: '',
    subCatalogId: 0,
    subCatalogName: undefined,

    colorId: 0,
    colorName: undefined,
    brandId: 0,
    brandName: undefined,
    articleId: 0,
    articleName: undefined,

    position: 0,
    inStock: false,
    sale: false,
    price: 0,
    markup: 0,
    cost_total: undefined,
    description: undefined,

    descriptionSeo: undefined,
  });

  private LoadSubCatalogProduct(idSubCatlog: number) {

    this.SubCatalogProduct$(idSubCatlog)
  }

  public ReLoadSubCatalogProduct(idSubCatlog: number) {
    this.SubCatalogProduct$(idSubCatlog)
  }

  constructor(
    private _http: HttpClient,
    private _url: ApiService,
    private subKatalogRepository: SubKatalogService,
    private  articleRepository:ArticleService,
    private  colorRepository :ColorService,
    private  brandRepository:BrandService,
    private  product_typeRepository:ProductTypeService
  ) {
    
  }

  private SubCatalogProduct$ = (idSubKatlog: number): void => {
    this.url.Controller = 'Article';
    this.url.Action = 'GetAll';
    this.url.ID = this.url.ClientId;
    this._http
      .get<Article[]>(this.url.Url, { headers: this.headers })
      .pipe(
        tap((data) => {
          //  this.state.update(() => data);
          this.state.update((state) => ({
            ...state,
            productItems: data,
            state: Status.load,
          }));
        }),
        //https://angularindepth.com/posts/1518/takeuntildestroy-in-angular-v16
        takeUntilDestroyed(),
        catchError(() => of([] as Article[])) //  on any error, just return an empty array
      )
      .subscribe();

    ///------------------------------------
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'NomenclaturePKs';
    this._url.ID = idSubKatlog;
    const postavchikId = 1; //this.url.PostavchikId;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });
    const params: HttpParams = new HttpParams().set(
      'postavchikId',
      postavchikId
    );

    const httpOptions = { headers, params };
    this._http
      .get<Product[]>(this._url.Url, httpOptions)
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((data: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return data.map((f: any) => {
            return <Product>(<unknown>{
              id: f.id,
              guid: f.guid,
              img_guids: f.img_guids ? [...f.img_guids.push(f.guid)] : [f.guid],
              name: f.name,
              description: f.description,

              cost_total: f.price * (f.markup / 100) + f.price,
              price: f.price,
              markup: f.markup,

              inStock: undefined,
              sale: f.sale,

              katalogId: f.katalogId,
              katalogName: this.subKatalogRepository
                .SubCatalogs()
                .find((d) => d.id === f.katalogId)?.name,

              colorId: f.colorId,
              colorName:
                this.Color().length > 0
                  ? this.Color().find((d) => d.id === f.colorId)?.name
                  : undefined,

              brandId: f.brandId,
              brandName:
                this.Brand().length > 0
                  ? this.Brand().find((d) => d.id === f.brandId)?.name
                  : undefined,

              articleId: f.articleId,
              articleName:
                this.Article().length > 0
                  ? this.Article().find((d) => d.id === f.articleId)?.name
                  : undefined,

              hidden: f.hidden,

              postavchikId: f.postavchikId,
            });
          });
        }),
        tap((data) => this.Products.set(data)),
        takeUntilDestroyed(),
        catchError(() => of([] as Product[])) //  on any error, just return an empty array
      )
      .subscribe();
  };

  PoductsSet = (idSubKatlog: string): void => {
    this.Poducts$(+idSubKatlog);
  };

  private ProductItem$ = (idProductItem: number): void => {
    //debugger
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'Item';
    this._url.ID = idProductItem;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });
    // let params:HttpParams=new HttpParams().set('postavchikId',this._url.PostavchikId)

    const httpOptions = { headers };
    this._http
      .get<Product>(this._url.Url, httpOptions)
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((f: any) => {
          //  console.log(JSON.stringify(data))
          return <Product>{
            id: f.id,
            guid: f.guid,
            img_guids: f.img_guids ? [...f.img_guids.push(f.guid)] : [f.guid],
            hidden: f.hidden,
            ownerId: f.ownerId,
            product_typeId: f.product_typeId,
            title: f.title,

            subCatalogId: f.katalogId,
            subCatalogName: this.subKatalogRepository
              .SubCatalogs()
              .find((d) => d.id === f.katalogId)?.name,

            colorId: f.colorId,
            colorName:
              this.Color().length > 0
                ? this.Color().find((d) => d.id === f.colorId)?.name
                : undefined,
            // colorName:this.sharedVar.ColorNs.length>0?this.sharedVar.ColorNs.find(d=>d.id===f.articleId)?.name:undefined,
            brandId: f.brandId,
            brandName:
              this.Brand().length > 0
                ? this.Brand().find((d) => d.id === f.brandId)?.name
                : undefined,

            articleId: f.articleId,
            articleName:
              this.Article().length > 0
                ? this.Article().find((d) => d.id === f.articleId)?.name
                : undefined,

            position: f.position,

            inStock: f.inStock,
            sale: f.sale,

            price: f.price,
            markup: f.markup,

            cost_total: f.price * (f.markup / 100) + f.price,

            description: f.description,
            descriptionSeo: f.descriptionSeo,
          };
        }),
        tap((data) => {
          this.ProductItem.set(data);
          console.log(JSON.stringify(data));
        }),
        takeUntilDestroyed(),
        catchError(() =>
          of({
            id: 0,
            guid: undefined,
            img_guids: undefined,
            hidden: false,
            ownerId: '',
            product_typeId: 0,
            title: '',
            subCatalogId: 0,
            subCatalogName: undefined,

            colorId: 0,
            colorName: undefined,
            brandId: 0,
            brandName: undefined,
            articleId: 0,
            articleName: undefined,

            position: 0,
            inStock: false,
            sale: false,
            price: 0,
            markup: 0,
            cost_total: undefined,
            description: undefined,

            descriptionSeo: undefined,
          } as Product)
        ) //  on any error, just return an empty ProductItem
      )
      .subscribe();
  };

  PoductsItemSet = (idProductItem: string): void => {
    this.ProductItem$(+idProductItem);
  };

  ///  for: nomenclatureItem  ___________________

 
}
