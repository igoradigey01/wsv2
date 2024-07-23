import { Injectable, signal, computed } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  // HttpParams,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiService } from '@wsv2/app-config';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserManagerService } from '@wsv2/account-service';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { Product, Status, Message } from '@wsv2/app-common';
//import {Brand, Color,} from '@wsv2/shop-content'
import { SubKatalogService } from './sub-katalog.service';
import { ArticleService } from './article.service';
import { BrandService } from './brand.service';
import { ColorService } from './color.service';
import { ProductTypeService } from './product_type.service';
import { KatlogService } from './katalog.servise';

import { tap, Observable, shareReplay, map, catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
//import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ProductListState {
  productItems: Product[];

  queryAdd: Product[];
  queryUpdate: Product[];
  queryDelete: Product[];

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

  readonly Articles = this.articleRepository.Articles;
  readonly Brands = this.brandRepository.Brands;
  readonly Colors = this.colorRepository.Colors;
  readonly Catalogs = this.katalogRepository.Katalogs;
  readonly SubCatalogs = this.subKatalogRepository.SubCatalogs;
  readonly serverUrl = this.url.ServerUri;

  readonly TypeProducts = this.product_typeRepository.ProductTypes;

  readonly Products = computed(() => this.state().productItems);
  readonly Message = computed(() => this.error_state());

  get WWWroot(): string {
    // return this.http.get(src,{responseType: 'blob'});

    return `${this.url.ServerUri}images/`; //environment.serverRoot + 'images/';
  }

  /*  ProductItem = signal<Product>({
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
  }); */

  constructor(
    private _http: HttpClient,
    private url: ApiService,
    private userManager: UserManagerService,
    private subKatalogRepository: SubKatalogService,
    private katalogRepository: KatlogService,
    private articleRepository: ArticleService,
    private colorRepository: ColorService,
    private brandRepository: BrandService,
    private product_typeRepository: ProductTypeService
  ) {
    //  console.log( "Input product-service subCatalog"+  JSON.stringify(subKatalogRepository.SubCatalogs))
    // console.log( "Input product-service Catalog"+  JSON.stringify(katalogRepository.Katalogs))
  }

  // GetForSubCatalog

   public LoadSubCatalogProduct(idSubCatlog: number) {
    this.SubCatalogProduct$(idSubCatlog);
  }

  private SubCatalogProduct$ = (idSubKatlog: number): void => {
    this.url.Controller = 'Product';
    this.url.Action = 'GetForSubCatalog';
    this.url.ID = this.url.ClientId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });
    const params: HttpParams = new HttpParams().set(
      'idSubCatalog',
      idSubKatlog
    );

    const httpOptions = { headers, params };
    this._http
      .get<Product[]>(this.url.Url, httpOptions)
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((data: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return data.map((f: any) => {
            return <Product>(<unknown>{
              id: f.id,
              guid: f.guid,      
              img_guids: f.img_guids ? [...f.img_guids.push(f.guid)] : [f.guid],       
              hidden:f.hidden,              
              ownerId:f.ownerId,
              product_typeId:f.product_typeId,
              title: f.title,

              subCatalogId:f.subCatalogId,
              subCatalogName:undefined,
              colorId:f.colorId,
              colorName: undefined,
              brandId:f.brandId,
              brandName: undefined,
              articleId:f.articleId,
              articleName:  undefined,

              position:f.position,
             

              inStock: f.inStock,
              sale: f.sale,
              
              price: f.price,
              markup: f.markup,
              cost_total: f.price * (f.markup / 100) + f.price,

              description: f.description,
              descriptionSeo:f.descriptionSeo,

              imageWebp:undefined,
              wwwrootOK:undefined ,                   // onChangeWebp?:boolean; // change  img on server (wwwroot/image)
               wwwroot:undefined

              

             

              
            });
          });
        }),
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
        catchError(() => of([] as Product[])) //  on any error, just return an empty array
      )
      .subscribe();

    ///------------------------------------
  };  
 
  public Create = (item: Product) => {
    this.Create$(item)
      .pipe(
        shareReplay(1), // последнее для всех (один раз!!! )item довавить в state
        tap((data) => {
          if (data) {
            this.state.update((state) => ({
              ...state,
              productItems: [...state.productItems, data as Product],
              state: Status.load,
            }));
          }
          //  console.log(' Create--(data-tap -Product-1)' + JSON.stringify(data))
        })
      )
      .subscribe({
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.state.update((d) => ({
            ...d,
            productItems: [...d.productItems],
            queryAdd: [...d.queryAdd, item],
            state: Status.modify,
          }));
          this.error_state.update((m) => ({ ...m, error: true }));
          if (err.status === 401) {
            this.error_state.update((m) => ({
              ...m,
              message: 'пользователь не авторизован,войдите на сайт',
            }));
            return;
          }
          if (err.status == 400) {
            this.error_state.update((m) => ({ ...m, message: err.error }));
            return;
          }

          this.error_state.update((m) => ({
            ...m,
            message:
              'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса',
          }));
          return;
        },
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private Create$ = (item: Product): Observable<any> => {
    //debugger
    this.url.Controller = 'Product';
    this.url.Action = 'Create';
    this.url.ID = null;
    item.ownerId = this.url.ClientId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.userManager.AccessToken(),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._http.post<any>(this.url.Url, item, {
      headers,
    });
  };

  public Update = (item: Product) => {
    // new Error("Протестировать правильность работы метода")
    this.Update$(item).subscribe({
      next: () => {
        //  console.log(res);
        this.state.update((d) => ({
          ...d,

          state: Status.modify,
        }));
        this.error_state.update((m) => ({
          ...m,
          message: 'The status was updated successfully!',
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.state.update((d) => ({
          ...d,
          queryUpdate: [...d.queryUpdate, item],
          state: Status.modify,
        }));
        this.error_state.update((m) => ({ ...m, error: true }));
        if (err.status === 401) {
          this.error_state.update((m) => ({
            ...m,
            message: 'пользователь не авторизован,войдите на сайт',
          }));
          return;
        }
        if (err.status == 400) {
          this.error_state.update((m) => ({ ...m, message: err.error }));
          return;
        }

        this.error_state.update((m) => ({
          ...m,
          message:
            'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса',
        }));
        return;
      },
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private Update$ = (item: Product): Observable<any> => {
    // throw new Error("not implemint exeption");
    this.url.Controller = 'Product';
    this.url.Action = 'Update';
    this.url.ID = item.id;
    item.ownerId = this.url.ClientId;
    //  debugger
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.userManager.AccessToken(),
    });

    //new Response(fd).text().then(console.log);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._http.put<any>(this.url.Url, item, {
      headers,
    });
  };

  public UpdateIgnoreImg = (item: Product) => {
    console.log(' - UpdateIgnoreImg -Product-)' + JSON.stringify(item));
    throw Error('NOt impiment Exeption');
  };

  public UpdateOnlyImg = (item: Product) => {
    console.log(' - UpdateOnlyImg -Product-)' + JSON.stringify(item));
    throw Error('NOt impiment Exeption');
  };

  public Delete = (item: Product) => {
    const newCatlogsList = this.state().productItems.filter(
      (d) => d.id !== item.id
    );

    this.Delete$(item.id).subscribe({
      next: () => {
        //console.log(res);
        this.state.update((d) => ({
          ...d,
          productItems: newCatlogsList,
          state: Status.modify,
        }));
        this.error_state.update((m) => ({
          ...m,
          message: 'The status was updated successfully!',
        }));
      },
      error: (err: HttpErrorResponse) => {
        // console.error(err);

        this.state.update((d) => ({
          ...d,
          productItems: newCatlogsList,
          queryDelete: [...d.queryDelete, item],
          state: Status.modify,
        }));
        this.error_state.update((m) => ({ ...m, error: true }));
        if (err.status === 401) {
          this.error_state.update((m) => ({
            ...m,
            message: 'пользователь не авторизован,войдите на сайт',
          }));
          return;
        }
        if (err.status == 400) {
          this.error_state.update((m) => ({ ...m, message: err.error }));
          return;
        }

        this.error_state.update((m) => ({
          ...m,
          message:
            'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса',
        }));
        return;
      },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private Delete$ = (id: number): Observable<any> => {
    this.url.Controller = 'Product';
    this.url.Action = 'Delete';
    this.url.ID = id;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.userManager.AccessToken(),
    });
    // let url: string = this._url.Url+'/'+id;
    return this._http.delete(this.url.Url, {
      headers,
    });
  };

  public ClearMessage() {
    this.error_state.update((m) => ({ ...m, message: '', error: false }));
  }
}
