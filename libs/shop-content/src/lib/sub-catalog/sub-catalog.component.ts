import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { KatalogComponent } from '@wsv2/ui';

import { IButton } from '@wsv2/app-common';
import { ShopApiService } from '../_shared/services/shop-api.service';

@Component({
    selector: 'wsv2-sub-catalog',
    imports: [KatalogComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './sub-catalog.component.html',
    styleUrls: ['./sub-catalog.component.scss']
})
export class SubCatalogComponent {

  subkatalogsSelect = computed(() =>
    this._repository.SubCatalogs().filter((f) => f.catalogId === +this.idKatatlog)
  );
  idKatatlog = -1;

  constructor(
    private _repository: ShopApiService,
    private routeActvate: ActivatedRoute,
    private router: Router,
  ) {
    this._repository.LoadCategories();
    routeActvate.params.subscribe(params => this.idKatatlog = +params['id']);
  }

  ChangeButton(idSubKatalog: IButton) {
    this.router.navigate(['/index/katalogs', this.idKatatlog, 'products', idSubKatalog.id]);
  }
}
