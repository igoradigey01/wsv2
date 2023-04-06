import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppLayoutModule} from '@wsv2/app-layout'
import  {MaterialModule}   from '../material.module'
import {RouterModule} from "@angular/router";
import {CompanyInformationService,MenyItemsService,IMenyItem} from '@wsv2/app-config'

@Component({
  selector: 'wsv2-index',
  standalone: true,
  imports: [
    CommonModule,
    AppLayoutModule,
    MaterialModule,
    RouterModule                  
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {


  title = ''; // not relize
  public _srcLogo:string='';
  public _menuItems:IMenyItem[]=[];
  public _company_name_1:string|undefined;
  public _company_name_2:string=""

 public _test_property=''

  _flagPanel: boolean = true;
 // _flagPanel2: boolean = false;
  _flagSideBarHiden = false;
  
  constructor(
  private  repositoryCompanyInformation:CompanyInformationService,
  private repositoryMenyItems:MenyItemsService
  ) {
    this._test_property=repositoryCompanyInformation.company_logo;
    this._srcLogo=repositoryCompanyInformation.company_logo;
    this._company_name_2=repositoryCompanyInformation.company_name;
    this.title=repositoryCompanyInformation.company_name;
    this._menuItems=repositoryMenyItems.shopMenyItems;

  }

  //ngOnInit(): void {}

  //---------------------------------
  onSideBarVisible() {
    this._flagPanel = !this._flagPanel;
  //  this._flagPanel2 = !this._flagPanel2;
    this._flagSideBarHiden = !this._flagSideBarHiden;
  }
}
