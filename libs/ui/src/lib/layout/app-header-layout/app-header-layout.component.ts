import { CommonModule } from '@angular/common';
import { signal } from "@angular/core";
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
//import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import {
  Component,
  Output, EventEmitter, Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';


import { IMenyItem } from '@wsv2/app-config';
import { UserRole } from '@wsv2/app-common'



@Component({
  selector: 'wsv2-app-header-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,

    MatBadgeModule,
    MatToolbarModule,
    MatMenuModule,
    // MatSelectModule,
    MatButtonModule,
    MatIconModule

  ],


  templateUrl: './app-header-layout.component.html',
  styleUrls: ['./app-header-layout.component.scss'],
})
/**
 * если пользователь авторизован то Это есть admin manager shopper shopperOpt
 * если пользователь не авторизован то Это есть default
 */
export class AppHeaderLayoutComponent {

  private userRole: UserRole = UserRole.default;

  private _isUserAutorize = signal(false);
  public label_cart_badge=false
  public  cart_amount=0;
  public is_shop_header = true;
  public label_opt = 'ОПТ ₽'
  public label_manager = 'Менеджер'
  public label_admin = "Админ";



  public get Label_amin_panel(){
    let label='';
    if(this.userRole==UserRole.admin){
      label='Админ'
    }
    if(this.userRole==UserRole.manager){
      label='Менеджер'
    }
    return label;
  }

  public get IsUserAutorize(){
    return this._isUserAutorize;
  }


  @Input() public set UserRole(role: UserRole) {
    //  this.userRole = role; -задаем сразу или потом долго ищем ошибку логики

    this.userRole = role;
    //console.log("@Input() set UserRole-- :" + role);

    //this.getViewHeader(role);
    this.thisUserAutorize(this.userRole);
    this.cd.detectChanges();

  }

  @Input() public set CartItemsCount(amount:number|undefined) {
    if(!amount||amount==0){
      this.cart_amount=0;
      this.label_cart_badge=false;
      this.cd.detectChanges();
     // return;
    }else{
    this.label_cart_badge=true;
    this.cart_amount=amount;
    this.cd.detectChanges();
    }

   }
  @Input() public set isShopHeader(viewHeader: boolean) {
    this.is_shop_header = viewHeader;

  }
  @Input() public company_name_1: string | undefined;
  @Input() public company_name_2: string | undefined; //First Site
  @Input() public srcLogo = '';
  @Input() public company_phone = '';
  @Input() public company_normalize_phone = '';
  @Input() public menuItems: IMenyItem[] = [];

  @Output() _onToggleSideBar = new EventEmitter<UserRole>();

  @Output() _onClickCart = new EventEmitter<UserRole>();

  @Output() _onClickLogin = new EventEmitter<UserRole>();
  @Output() _onClickLogof = new EventEmitter<UserRole>();



  @Output() _onClickOrder = new EventEmitter<UserRole>();

  @Output() _onClickOptPrice = new EventEmitter<UserRole>();
  @Output() _onClickNotOptPrice = new EventEmitter<UserRole>();
  @Output() _onClickManager = new EventEmitter<UserRole>();
  @Output() _onClickAdmin = new EventEmitter<UserRole>();
  @Output() _onClickGoAppShop = new EventEmitter<UserRole>();




  public MenuItems = (): IMenyItem[] => {
    return this.menuItems;
  };

  public get AutorizeCssObj(): string {
    //debugger
    if (this._isUserAutorize())
      return 'user-autorize';
    return 'user-not-autorize';
  }

  constructor(
    private cd: ChangeDetectorRef
  ) {

  }


  public on_click_cart() {
    this._onClickCart.emit(this.userRole);

  }

  public on_click_login() {

    this._onClickLogin.emit(this.userRole);

  }

  public on_click_logof(){

    this._onClickLogof.emit(this.userRole);

  }

  public on_click_order(userRole: string) {

    // check not realize

    this._onClickOrder.emit(this.userRole);

  }

  public on_click_OptPrice() {
    this.label_opt = 'ОПТ ₽'
    this._onClickOptPrice.emit(this.userRole);
  }

  on_click_NotOptPrice() {
    this.label_opt = 'РОЗН ₽'
    this._onClickNotOptPrice.emit(this.userRole);


  }

  on_click_manager(actionName: string) {
    if (actionName === 'manager') {
      this.label_manager = 'Менеджер';
      this._onClickManager.emit(this.userRole);
    }
    if (actionName === 'opt') {
      this.label_manager = 'ОПТ ₽';
      this._onClickOptPrice.emit(this.userRole);
    }

    if (actionName === 'not_opt') {
      this.label_manager = 'РОЗН ₽'
      this._onClickNotOptPrice.emit(this.userRole);
    }
  }


  on_click_admin(actionName: string) {
    if (actionName === 'admin') {
      this.label_admin = 'Админ';
      this._onClickAdmin.emit(this.userRole);
    }

    if (actionName === 'manager') {
      this.label_admin = 'Менеджер';
      this._onClickManager.emit(this.userRole);
    }
    if (actionName === 'opt') {
      this.label_admin = 'ОПТ ₽';
      this._onClickOptPrice.emit(this.userRole);
    }

    if (actionName === 'not_opt') {
      this.label_admin = 'РОЗН ₽'
      this._onClickNotOptPrice.emit(this.userRole);
    }
  }

  public onSideBarVisible(): void {
    //  this.login.emit(this.loginForm.value)
    this._onToggleSideBar.emit();
  }

  public on_click_go_app_shop(){
    this._onClickGoAppShop.next(this.userRole);

  }


  public get IsAdmin(): boolean {
    if (this.userRole === UserRole.admin) {
      return true;
    }
    return false;
  }
  public get IsManager(): boolean {
    // return true;
    if (
      this.userRole === UserRole.manager) {
      return true;
    }
    return false;
  }
  public get IsShopper(): boolean {

    if (this.userRole === UserRole.shoper || this.userRole == UserRole.shoperOpt) {
      return true;
    }
    return false;
  }
  public get IsOpt(): boolean {

    if (this.userRole === UserRole.shoperOpt || this.userRole == UserRole.opt) {
      return true;
    }
    return false;
  }



  // чет не чет -Остаток от деления (%)
  /** это число четное ? */
  private isOdd(number: number) {
    return number % 2 === 0 ? true : false
  }

  private thisUserAutorize(userRole: UserRole) {
    //debugger
    if (this.userRole == UserRole.admin) {
      this._isUserAutorize.set( true);
      //   console.log("--UserRole--"+this.userRole);
      return;
    }

    if (this.userRole == UserRole.manager) {
      this._isUserAutorize.set( true);
      //  console.log("--UserRole--"+this.userRole);
      return;
    }
    if (this.userRole == UserRole.shoperOpt) {
      this._isUserAutorize.set( true);
      //  console.log("--UserRole--"+this.userRole);
      return;
    }
    if (this.userRole == UserRole.shoper) {
      this._isUserAutorize.set( true);
      // console.log("--UserRole--"+this.userRole);
      return;
    }

    this._isUserAutorize.set(false);

    //  this.cd.detectChanges();
  //  console.log("--UserRole = false --" + this.userRole);

  }

}
