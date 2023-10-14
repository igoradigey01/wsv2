import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppLayoutModule } from '@wsv2/app-layout';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import {
  CompanyInformationService,
  MenyItemsService,
  IMenyItem,
} from '@wsv2/app-config';
import { KatalogComponent, AppHeaderLayoutComponent } from '@wsv2/ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OptManagerService } from '@wsv2/shop-opt';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserRole } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CartService } from '@wsv2/shop-cart';

@Component({
  selector: 'wsv2-index',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderLayoutComponent,
    AppLayoutModule,
    MaterialModule,
    RouterModule,
    KatalogComponent,
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {


  private _cartItemsCount = computed(() =>
    this.repositoryCart
      .cartItems()
      .reduce((acc, item) => acc + item.quantity, 0)
  );

  

  _flagPanel = true; // sidenav
  _flagSideBarHiden = false; //sidenav

   public userRole=computed(
   
    ()=>{
      if(this.repositoryOpt.flagOpt()){
        return UserRole.opt
      }else return UserRole.default
    }
   )

  title = ''; // not relize
  public _srcLogo = '';
  public _menuItems: IMenyItem[] = [];
  public _company_name_1: string | undefined;
  public _company_name_2 = '';
  public _company_phone = '';
  public _company_normalize_phone = '';
  public is_shop = true;
 // public roleUser: UserRole = UserRole.default;

  get CartItemsCount(): number {
    return this._cartItemsCount();
  }
  // set CartItemsCount(item: number) {
  //   this._cartItemsCount = item;
  // }

  constructor(
    private repositoryCompanyInformation: CompanyInformationService,
    private repositoryMenyItems: MenyItemsService,
    private repositoryCart: CartService,
    private repositoryOpt: OptManagerService,
    private router: Router
  ) {
    this._srcLogo = repositoryCompanyInformation.company_logo;
    this._company_name_2 = repositoryCompanyInformation.company_name;
    this.title = repositoryCompanyInformation.company_name;
    this._company_phone = repositoryCompanyInformation.company_phone;
    this._company_normalize_phone =
      repositoryCompanyInformation.company_normalize_phone;
    this._menuItems = repositoryMenyItems.shopMenyItems;
    
  }

  public onClickCart(userRole: UserRole) {
    this.router.navigate(['index/cart']);
  }
  public onClickLogin(userRole: UserRole) {
    this.router.navigate(['index/account']);
  }

  public onClickLogof(userRole: UserRole) {
    // debugger
    this.router.navigate(['index/account/sing-off']);
  }
  public onClickOrder(userRole: UserRole) {
    this.router.navigate(['index/order']);
  }
  public onClickOptPrice(userRole: UserRole) {
    this.router.navigate([`index/katalog/opt/${this.id_katalog}`]);
  }
  private id_katalog = 0;
  onClickNotOptPrice(userRole: UserRole) {
    this.router.navigate([`index/katalog/${this.id_katalog}`]);
  }
  onClickManager(userRole: UserRole) {
    this.router.navigate(['manager']);
  }
  onClickAdmin(userRole: UserRole) {
    this.router.navigate(['admin']);
  }
  onClickGoAppShop(userRole: UserRole) {
    this.router.navigate(['index']);
  }
  onSideBarVisible() {
    this._flagPanel = !this._flagPanel;
    //  this._flagPanel2 = !this._flagPanel2;
    this._flagSideBarHiden = !this._flagSideBarHiden;
  }
}
