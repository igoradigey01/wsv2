import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { EnvironmentService } from '@wsv2/app-config';
import { Product, Katalog, SubKatalog } from '@wsv2/app-common';

/** Узел дерева групп номенклатуры из ShopApi. */
interface ГруппаВитриныApi {
  id: number;
  название: string;
  родительId?: number | null;
  дети?: ГруппаВитриныApi[];
}

interface КаталогВитриныApi {
  группы: ГруппаВитриныApi[];
  категории: { id: number; название: string }[];
}

/** Позиция витрины из ShopApi (camelCase-ключи с кириллицей). */
export interface ТоварВитриныApi {
  id: number;
  название: string;
  краткоеНазвание?: string;
  артикул?: string;
  описание?: string;
  цена?: number;
  группаId?: number;
  группа?: string;
  едИзм?: string;
  seoОписание?: string;
  наценка?: number;
  порядок: number;
  естьФото: boolean;
  фотоУрл?: string;
}

/**
 * Витрина веб-магазина на новом ShopApi (SkladDB).
 * Каталог = корни дерева ГруппаНоменклатуры, подкаталог = дочерняя группа,
 * товары — Номенклатура с ПоказыватьВМагазине = 1.
 */
@Injectable({
  providedIn: 'root',
})
export class ShopApiService {
  private readonly _katalogs = signal<Katalog[]>([]);
  private readonly _subKatalogs = signal<SubKatalog[]>([]);
  private readonly _products = signal<Product[]>([]);
  private readonly _loaded = signal(false);

  readonly Katalogs = computed(() => this._katalogs());
  readonly SubCatalogs = computed(() => this._subKatalogs());
  readonly Products = computed(() => this._products());

  /** Сигнал «ровно один каталог» — авто-переход в подкаталог. */
  readonly indicatorSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private env: EnvironmentService
  ) {}

  /** Базовый адрес нового ShopApi (без завершающего слэша). */
  get ShopUri(): string {
    const base = this.env.shopUri ?? 'http://localhost:5250/';

    return base.replace(/\/+$/, '');
  }

  private url(path: string): string {
    return `${this.ShopUri}/api/shop/${path}`;
  }

  LoadCategories(): void {
    this.http
      .get<КаталогВитриныApi>(this.url('categories'))
      .pipe(
        tap((data) => {
          const roots = data?.группы ?? [];
          this._katalogs.set(roots.map((root) => this.toKatalog(root)));
          this._subKatalogs.set(this.flattenSubKatalogs(roots));
          this._loaded.set(true);
          this.indicatorSubject.next(roots.length === 1);
        }),
        catchError(() => {
          this._loaded.set(true);
          this.indicatorSubject.next(false);

          return of(null);
        })
      )
      .subscribe();
  }

  LoadProducts(groupId: number): void {
    this.http
      .get<ТоварВитриныApi[]>(
        this.url(`products?groupId=${groupId}&limit=200`)
      )
      .pipe(
        tap((data) => {
          this._products.set((data ?? []).map((dto) => this.toProduct(dto)));
        }),
        catchError(() => {
          this._products.set([]);

          return of(null);
        })
      )
      .subscribe();
  }

  private toKatalog(node: ГруппаВитриныApi): Katalog {
    return {
      id: node.id,
      ownerId: '',
      name: node.название,
      hidden: false,
      decriptSeo: '',
    };
  }

  private flattenSubKatalogs(roots: ГруппаВитриныApi[]): SubKatalog[] {
    const result: SubKatalog[] = [];

    const walk = (nodes: ГруппаВитриныApi[], catalogId: number): void => {
      for (const node of nodes) {
        result.push({
          id: node.id,
          ownerId: '',
          catalogId,
          GoogleTypeId: null,
          name: node.название,
          hidden: false,
          decriptSeo: null,
        });

        if (node.дети?.length) {
          walk(node.дети, node.id);
        }
      }
    };

    for (const root of roots) {
      if (root.дети?.length) {
        walk(root.дети, root.id);
      }
    }

    return result;
  }

  private toProduct(dto: ТоварВитриныApi): Product {
    const photoUrl = dto.фотоУрл ? `${this.ShopUri}${dto.фотоУрл}` : undefined;

    return {
      id: dto.id,
      guid: undefined,
      img_guids: [],
      hidden: false,
      ownerId: '',
      product_typeId: 0,
      title: dto.название,
      subCatalogId: dto.группаId ?? 0,
      subCatalogName: dto.группа,
      colorId: 0,
      colorName: undefined,
      brandId: 0,
      brandName: undefined,
      articleId: 0,
      articleName: dto.артикул,
      position: dto.порядок ?? 0,
      inStock: true,
      sale: false,
      price: dto.цена ?? 0,
      markup: dto.наценка ?? 0,
      cost_total: dto.цена ?? 0,
      description: dto.описание,
      descriptionSeo: dto.seoОписание,
      imageWebp: undefined,
      wwwroot: this.ShopUri,
      photoUrl,
      photoUrls: photoUrl ? [photoUrl] : [],
    };
  }
}
