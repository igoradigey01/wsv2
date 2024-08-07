import { Component,  signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import { AppLayoutModule } from '@wsv2/app-layout'
import { MaterialModule } from '../material.module'
import { RouterModule } from "@angular/router";
import { CompanyInformationService, MenyItemsService, IMenyItem } from '@wsv2/app-config'
import { KatalogComponent, IButton, AppHeaderLayoutComponent } from '@wsv2/ui'
import { UserRole } from '@wsv2/app-common'
import { NgFor, NgClass, NgIf } from '@angular/common';


@Component({
  selector: 'wsv2-index',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderLayoutComponent,
    AppLayoutModule,
    MaterialModule,
    RouterModule,
    KatalogComponent
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {

  private _cartItemsCount = 0; // haader
  
  _flagPanel: boolean = true; // sidenav 
  _flagSideBarHiden = false; //sidenav


 




  

  title = ''; // not relize
  public _srcLogo: string = '';
  public _menuItems: IMenyItem[] = [];
  public _company_name_1: string | undefined;
  public _company_name_2: string = ""
  public _company_phone: string = '';
  public _company_normalize_phone: string = '';
  //public is_shop = true;
  public roleUser =signal<UserRole>( UserRole.admin);
  public roles=['default', 'opt','shoper','shoperOpt','manager','admin'] 

  
 private mapinRole(rolename:string){
  if(rolename=='default'){
    this.roleUser.set(UserRole.default)
  }
  if(rolename=='opt'){
    this.roleUser.set(UserRole.opt)
  }
  if(rolename=='shoper'){
    this.roleUser.set(UserRole.shoper)
  }
  if(rolename=='shoperOpt'){
    this.roleUser.set(UserRole.shoperOpt)
  }
  if(rolename=='manager'){
    this.roleUser.set(UserRole.manager)
  }
  if(rolename=='admin'){
    this.roleUser.set(UserRole.admin)
  }
 }

  

  

  get CartItemsCount(): number {
    return this._cartItemsCount;
  }
  set CartItemsCount(item: number) {
    this._cartItemsCount = item;
  }

  constructor(
    private repositoryCompanyInformation: CompanyInformationService,
    private repositoryMenyItems: MenyItemsService,
    private router: Router
  ) {    
    this._srcLogo = repositoryCompanyInformation.company_logo;
    this._company_name_2 = repositoryCompanyInformation.company_name;
    this.title = repositoryCompanyInformation.company_name;
    this._company_phone = repositoryCompanyInformation.company_phone;
    this._company_normalize_phone = repositoryCompanyInformation.company_normalize_phone;
    this._menuItems = repositoryMenyItems.shopMenyItems;
  }

  public onClickCart(userRole:UserRole){
    this.router.navigate(['index/cart']);

  }
   public onClickLogin(userRole:UserRole){
    this.router.navigate(['index/account']);

  }

  public onClickLogof(userRole:UserRole){
    this.router.navigate(['index/account/sing-off']);

  }
  public onClickOrder(userRole:UserRole){
    this.router.navigate(['index/order']);

  }
  public  onClickOptPrice(userRole:UserRole){
    this.router.navigate([`index/katalog/opt/${this.id_katalog}`]);

  }
   private id_katalog=0;
  onClickNotOptPrice(userRole:UserRole){
    this.router.navigate([`index/katalog/${this.id_katalog}`]);

  }
  onClickManager(userRole:UserRole){
    this.router.navigate(['manager']);

  }
  onClickAdmin(userRole:UserRole){
    this.router.navigate(['admin']);

  }
  onClickGoAppShop(userRole:UserRole){
    this.router.navigate(['index']);

  }
  onSideBarVisible() {
    this._flagPanel = !this._flagPanel;
    //  this._flagPanel2 = !this._flagPanel2;
    this._flagSideBarHiden = !this._flagSideBarHiden;
  }

  changeRole(role:any){
   
  //  console.log(role.target.value);
   this.mapinRole(role.target.value)
    

  }
}
