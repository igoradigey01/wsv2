import { Component,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule ,Router} from '@angular/router';
import { AppLayoutModule } from '@wsv2/app-layout';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {  AppHeaderLayoutComponent } from '@wsv2/ui'
import { MaterialModule } from '../material.module'
import { CompanyInformationService, MenyItemsService, IMenyItem } from '@wsv2/app-config';
import { IThemeScss, ThemeScssServices } from '@wsv2/app-common'
import { UserRole } from '@wsv2/app-common'


@Component({
  selector: 'wsv2-admin-index',
  standalone: true,
  imports: [
    CommonModule,
    AppLayoutModule,
    AppHeaderLayoutComponent ,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers:[ThemeScssServices]
})
export class IndexComponent implements  OnDestroy {
   
  private _theme_css: IThemeScss = <IThemeScss>{
    // --base-color-for-m3-palete:#6750A4;
    primary_color: "#7F67BE",
    primary_lighter_color: "#D0BCFF",
    primary_darker_color: "#381E72",
    accent_color: "#7A7289",
    accent_lighter_color:"#CCC2DC",
    accent_darker_color: "#332D41",
    tertiary_color: "#986977",
    tertiary_container_color:"#ffd9e3",
    on_tertiary_color: "#ffffff",
    on_tertiary_container_color:"#31101d"
  }


  public _menuItems: IMenyItem[] = [];
  public _company_name_2: string | undefined;
  public _company_name_1: string | undefined;
  
  public _roleUser="Admin";
  public roleUser: UserRole = UserRole.admin;

  public _company_phone = '';
  public _company_normalize_phone = '';


  public _test_property = ''

  _flagPanel = true;
  // _flagPanel2: boolean = false;
  _flagSideBarHiden = false;

  constructor(
    private repositoryCompanyInformation: CompanyInformationService,
    private repositoryMenyItems: MenyItemsService,
    private repositoryThemeCss: ThemeScssServices,
    private router: Router
  ) {

    this._test_property = repositoryCompanyInformation.company_logo;
    this._company_name_2 = repositoryCompanyInformation.company_name;
    this._company_phone = repositoryCompanyInformation.company_phone;
    this._company_normalize_phone = repositoryCompanyInformation.company_normalize_phone;
    this._menuItems = repositoryMenyItems.adminMenyItems;

    repositoryThemeCss.initThemeComponent(this._theme_css);

 
  }


  
  ngOnDestroy(): void {
   // debugger
    this.repositoryThemeCss.destroyThemeComponent();

  }

  //---------------------------------
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


}
