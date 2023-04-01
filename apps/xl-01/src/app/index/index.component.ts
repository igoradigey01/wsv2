import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppLayoutModule} from '@wsv2/app-layout'
import  {MaterialModule}   from '../material.module'
import {RouterModule} from "@angular/router";

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


  title = 'xl01';
  public _srcLogo:string='./../assets/logo/logo.webp';
  public _srcMenuJson:string="../assets/menu.json"
  public _company_name_1:string|undefined;
  public _company_name_2:string="XL01"

  _flagPanel: boolean = true;
 // _flagPanel2: boolean = false;
  _flagSideBarHiden = false;
  
  constructor() {}

  //ngOnInit(): void {}

  //---------------------------------
  onSideBarVisible() {
    this._flagPanel = !this._flagPanel;
  //  this._flagPanel2 = !this._flagPanel2;
    this._flagSideBarHiden = !this._flagSideBarHiden;
  }
}
