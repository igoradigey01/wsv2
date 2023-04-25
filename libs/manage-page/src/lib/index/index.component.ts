import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {AppLayoutModule} from '@wsv2/app-layout'
import {CompanyInformationService,MenyItemsService,IMenyItem} from '@wsv2/app-config'
import {MaterialModule} from '../material.module'


@Component({
  selector: 'wsv2-index',
  standalone: true,
  imports: [
    CommonModule,
    AppLayoutModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {

  title = 'xl01';


  
  public _srcLogo:string='';
  public _menuItems:IMenyItem[]=[];
  public _company_name_1:string|undefined;
  public _company_name_2:string=""
   public _company_phone:string='';
   public _company_normalize_phone:string='';


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
    this._company_phone=repositoryCompanyInformation.company_phone;
    this._company_normalize_phone=repositoryCompanyInformation.company_normalize_phone;
    this._menuItems=repositoryMenyItems.managerMenyItems;
    let x='#705d00'
  //  document.body.style.setProperty("--primary-color", "#F4B183");
  //  document.body.style.setProperty("--accent-color", "#DFA67B");

  }

  //ngOnInit(): void {}

  //---------------------------------
  onSideBarVisible() {
    this._flagPanel = !this._flagPanel;
  //  this._flagPanel2 = !this._flagPanel2;
    this._flagSideBarHiden = !this._flagSideBarHiden;
  }

}
