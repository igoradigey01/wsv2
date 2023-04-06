import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {AppLayoutModule} from '@wsv2/app-layout'
import  {MaterialModule}   from '../material.module'


@Component({
  selector: 'wsv2-manager',
  standalone: true,
  imports: [
    CommonModule,
    AppLayoutModule,
    MaterialModule,
    RouterModule                  
  ],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent {

  title = 'xl01';


  _flagPanel: boolean = true;
  // _flagPanel2: boolean = false;
   _flagSideBarHiden = false;

   constructor() {}

   onSideBarVisible() {
    this._flagPanel = !this._flagPanel;
  //  this._flagPanel2 = !this._flagPanel2;
    this._flagSideBarHiden = !this._flagSideBarHiden;
  }
}
