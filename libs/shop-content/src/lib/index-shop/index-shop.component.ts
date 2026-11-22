import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import type { OnInit } from '@angular/core';
import { Router, ActivatedRoute, type Params } from '@angular/router';

import { KatalogComponent } from '@wsv2/ui';
import { IButton, UserRole } from '@wsv2/app-common';
import { UserManagerService } from '@wsv2/account-service';

import { ShopApiService } from '../_shared/services/shop-api.service';

@Component({
    selector: 'wsv2-index-shop',
    imports: [KatalogComponent],
    templateUrl: './index-shop.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./index-shop.component.scss']
})
export class IndexShopComponent implements OnInit {

  katalogs = computed(() => {
    return this.repositoryCatalog.Katalogs().filter((f) => f.hidden == false);
  });

  constructor(
    private repositoryCatalog: ShopApiService,
    private userManager: UserManagerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.repositoryCatalog.LoadCategories();
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(
      (queryParam: Params) => {
        const opt = queryParam['opt'];
        if (opt) {
          this.userManager.SetCustomerOpt(true);

          if (this.userManager.Role() == UserRole.default) {
            this.userManager.SetRole(UserRole.opt);
          }
        }
      }
    );

    // если каталог один — сразу перейти в подкаталог
    this.repositoryCatalog.indicatorSubject.subscribe((d) => {
      if (d && this.repositoryCatalog.Katalogs().length > 0) {
        this.router.navigate([
          '/index/katalogs',
          this.repositoryCatalog.Katalogs()[0].id,
        ]);
      }
    });
  }

  ChangeButton(katalog: IButton) {
    this.router.navigate(['/index/katalogs', katalog.id]);
  }
}
