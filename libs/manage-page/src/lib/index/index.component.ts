import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppLayoutModule } from '@wsv2/app-layout';
import { MaterialModule } from '../material.module'
import { CompanyInformationService, MenyItemsService, IMenyItem } from '@wsv2/app-config';
import { IThemeScss, ThemeScssServices } from '@wsv2/app-common'


@Component({
  selector: 'wsv2-manager-index',
  standalone: true,
  imports: [
    CommonModule,
    AppLayoutModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers:[ThemeScssServices]
})
export class IndexComponent implements OnInit, OnDestroy {

  private _theme_css: IThemeScss = <IThemeScss>{
    primary_color: "#ffb94f",
    primary_lighter_color: "#ffeaca",
    primary_darker_color: "#ffa236",
    accent_color: "#ddc2a1",
    accent_lighter_color:"#f5ede3",
    accent_darker_color: "#cfac85",
    tertiary_color: "#3a4c2a",
    tertiary_container_color:"#b8cea1",
    on_tertiary_color: "#ffffff",
    on_tertiary_container_color:"#243516"
  }


  public _menuItems: IMenyItem[] = [];
  public _company_name_2: string | undefined;

  public _company_phone: string = '';
  public _company_normalize_phone: string = '';


  public _test_property = ''

  _flagPanel: boolean = true;
  // _flagPanel2: boolean = false;
  _flagSideBarHiden = false;

  constructor(
    private repositoryCompanyInformation: CompanyInformationService,
    private repositoryMenyItems: MenyItemsService,
    private repositoryThemeCss: ThemeScssServices
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

  //---------------------------------
  onSideBarVisible() {
    this._flagPanel = !this._flagPanel;
    //  this._flagPanel2 = !this._flagPanel2;
    this._flagSideBarHiden = !this._flagSideBarHiden;
  }



}
