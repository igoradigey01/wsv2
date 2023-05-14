import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppLayoutModule} from '@wsv2/app-layout'
import  {MaterialModule}   from '../material.module'
import {RouterModule} from "@angular/router";
import {CompanyInformationService,MenyItemsService,IMenyItem} from '@wsv2/app-config'
import {KatalogComponent,IButton,AppHeaderLayoutComponent} from '@wsv2/ui'
import { UserRole} from '@wsv2/app-common'


@Component({
  selector: 'wsv2-index',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderLayoutComponent,
    AppLayoutModule,
    MaterialModule,
    RouterModule ,
    KatalogComponent                 
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {

   tempRepozitory:IButton[]=[
   <IButton>{id:1,name:"каталог-1"},
   <IButton>{id:2,name:"каталог-2"},
   <IButton>{id:3,name:"каталог-3"},
   <IButton>{id:4,name:"каталог-4"},
   <IButton>{id:5,name:"каталог-5"},
   <IButton>{id:6,name:"каталог-6"},
   <IButton>{id:7,name:"каталог-7"},
   <IButton>{id:8,name:"каталог-8"},
   <IButton>{id:9,name:"каталог-9"},
   <IButton>{id:10,name:"каталог-10"},
   <IButton>{id:11,name:"каталог-11"},
  ]

  title = ''; // not relize
  public _srcLogo:string='';
  public _menuItems:IMenyItem[]=[];
  public _company_name_1:string|undefined;
  public _company_name_2:string=""
   public _company_phone:string='';
   public _company_normalize_phone:string='';
   public is_shop=true;
   public roleUser:UserRole=UserRole.default;


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
