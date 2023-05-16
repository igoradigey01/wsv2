import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import {
  Component, OnInit, OnDestroy,
  Output, EventEmitter, Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { IMenyItem } from '@wsv2/app-config';
import { UserRole } from '@wsv2/app-common'
import { of } from 'rxjs';


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

  private isUserAutorize: boolean = false;
  public view_header: boolean = true;
  public label_opt = 'ОПТ ₽'
  public label_manager = 'Менеджер'
  public label_admin = "Админ";


  @Input() public set UserRole(role: UserRole) {
    //  this.userRole = role; -задаем сразу или потом долго ищем ошибку логики

    this.userRole = role;
    //console.log("@Input() set UserRole-- :" + role);

    //this.getViewHeader(role);
    this.thisUserAutorize(this.userRole);
    this.cd.detectChanges();

  }
  @Input() public set SetCartCount(role: UserRole) { }
  @Input() public set isShopHeader(viewHeader: boolean) {
    this.view_header = viewHeader;

  }
  @Input() public company_name_1: string | undefined;
  @Input() public company_name_2: string | undefined; //First Site
  @Input() public srcLogo: string = '';
  @Input() public company_phone: string = '';
  @Input() public company_normalize_phone: string = '';
  @Input() public menuItems: IMenyItem[] = [];

  @Output() onToggleSideBar = new EventEmitter<UserRole>();

  @Output() onClickCart = new EventEmitter<UserRole>();

  @Output() onClickLogin = new EventEmitter<UserRole>();

  @Output() onClickOrder = new EventEmitter<UserRole>();

  @Output() onClickOptPrice = new EventEmitter<UserRole>();
  @Output() onClickNotOptPrice = new EventEmitter<UserRole>();
  @Output() onClickManager = new EventEmitter<UserRole>();
  @Output() onClickAdmin = new EventEmitter<UserRole>();




  public MenuItems = (): IMenyItem[] => {
    return this.menuItems;
  };

  public get AutorizeCssObj(): string {
    //debugger
    if (this.isUserAutorize)
      return 'user-autorize';
    return 'user-not-autorize';
  }

  constructor(
    private cd: ChangeDetectorRef
  ) {

  }


  public on_click_cart() {
    this.onClickCart.emit(this.userRole);

  }

  public on_click_login() {

    this.onClickLogin.emit(this.userRole);

  }

  public on_click_order(userRole: string) {

    // check not realize

    this.onClickOrder.emit(this.userRole);

  }

  public on_click_OptPrice() {
    this.label_opt = 'ОПТ ₽'
    this.onClickOptPrice.emit(this.userRole);
  }

  on_click_NotOptPrice() {
    this.label_opt = 'РОЗН ₽'
    this.onClickNotOptPrice.emit(this.userRole);


  }

  on_click_manager(actionName: string) {
    if (actionName === 'manager') {
      this.label_manager = 'Менеджер';
      this.onClickManager.emit(this.userRole);
    }
    if (actionName === 'opt') {
      this.label_manager = 'ОПТ ₽';
      this.onClickOptPrice.emit(this.userRole);
    }

    if (actionName === 'not_opt') {
      this.label_manager = 'РОЗН ₽'
      this.onClickNotOptPrice.emit(this.userRole);
    }
  }


  on_click_admin(actionName: string) {
    if (actionName === 'admin') {
      this.label_admin = 'Админ';
      this.onClickAdmin.emit(this.userRole);
    }

    if (actionName === 'manager') {
      this.label_admin = 'Менеджер';
      this.onClickManager.emit(this.userRole);
    }
    if (actionName === 'opt') {
      this.label_admin = 'ОПТ ₽';
      this.onClickOptPrice.emit(this.userRole);
    }

    if (actionName === 'not_opt') {
      this.label_admin = 'РОЗН ₽'
      this.onClickNotOptPrice.emit(this.userRole);
    }
  }

  public onSideBarVisible(): void {
    //  this.login.emit(this.loginForm.value)
    this.onToggleSideBar.emit();
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

  /*  private getViewHeader(userRole:UserRole){
     //debugger
     if(userRole==UserRole.admin||userRole==UserRole.manager){
       this.is_shop=false
       return;      
     }
     this.is_shop=true;
   } */

  // чет не чет -Остаток от деления (%)
  /** это число четное ? */
  private isOdd(number: number) {
    return number % 2 === 0 ? true : false
  }

  private thisUserAutorize(userRole: UserRole) {
    //debugger
    if (this.userRole == UserRole.admin) {
      this.isUserAutorize = true;
      //   console.log("--UserRole--"+this.userRole);
      return;
    }

    if (this.userRole == UserRole.manager) {
      this.isUserAutorize = true;
      //  console.log("--UserRole--"+this.userRole);
      return;
    }
    if (this.userRole == UserRole.shoperOpt) {
      this.isUserAutorize = true;
      //  console.log("--UserRole--"+this.userRole);
      return;
    }
    if (this.userRole == UserRole.shoper) {
      this.isUserAutorize = true;
      // console.log("--UserRole--"+this.userRole);
      return;
    }

    this.isUserAutorize = false;

    //  this.cd.detectChanges();
    console.log("--UserRole = false --" + this.userRole);

  }

}
