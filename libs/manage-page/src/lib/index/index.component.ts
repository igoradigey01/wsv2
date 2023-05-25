import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule ,Router} from '@angular/router';
import { AppLayoutModule } from '@wsv2/app-layout';
import { KatalogComponent, IButton, AppHeaderLayoutComponent } from '@wsv2/ui'
import { MaterialModule } from '../material.module'
import { CompanyInformationService, MenyItemsService, IMenyItem } from '@wsv2/app-config';
import { IThemeScss, ThemeScssServices } from '@wsv2/app-common'
import { UserRole } from '@wsv2/app-common'


@Component({
  selector: 'wsv2-manager-index',
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
export class IndexComponent implements OnInit, OnDestroy {

  private _theme_css: IThemeScss = <IThemeScss>{
    primary_color: "#a26c00", //primary50
    primary_lighter_color: "#ffddb3",//primary90
    primary_darker_color: "#452b00",//primary20
    accent_color: "#8a7357",//secondary50
    accent_lighter_color:"#fadebc",//secondary90
    accent_darker_color: "#3e2d16",//secondary20
    tertiary_color: "#697d57", //tertiary50
    tertiary_container_color:"#d4eabc",//tertiary90
    on_tertiary_color: "#ffffff",
    on_tertiary_container_color:"#243516"
  }


  public _menuItems: IMenyItem[] = [];
  public _company_name_2: string | undefined;
  public _company_name_1: string | undefined;
  

  public _company_phone: string = '';
  public _company_normalize_phone: string = '';
  public _roleUser="Менеджер"
  public roleUser: UserRole = UserRole.manager;


  public _test_property = ''

  _flagPanel: boolean = true;
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
    this._menuItems = repositoryMenyItems.managerMenyItems;    

    repositoryThemeCss.initThemeComponent(this._theme_css);

 
  }

  ngOnInit(): void {
 
   }

  
  ngOnDestroy(): void {
   // debugger
    this.repositoryThemeCss.destroyThemeComponent();

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


}
