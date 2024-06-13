import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StateView } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Katalog } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {KatlogService } from '@wsv2/shop-content';
import {CatalogListComponent} from '../catalog-list/catalog-list.component'
import {CatalogItemComponent} from '../catalog-item/catalog-item.component'

export interface EmitData{
  catalog:Katalog,
  stateView:StateView
}

@Component({
  selector: 'wsv2-catalog-shell',
  standalone: true,
  imports: [
    CommonModule,
    CatalogListComponent,
    CatalogItemComponent
  ],
  templateUrl: './catalog-shell.component.html',
  styleUrls: ['./catalog-shell.component.scss'],
})
export class CatalogShellComponent {

  public flag=StateView.default;

  public catalogs = this.repository.Katalogs; 

  public message=this.repository.Message;
   
  public item=<Katalog>{id:0,name:"none",ownerId:"none", decriptSeo:'',hidden:false};
  

  constructor(
    private repository: KatlogService
    ) {

      repository.ClearMessage();
    }

 

  //----------------------

 public  onCatalogChange(event:EmitData){
  this.item=event.catalog;
  this.flag=event.stateView;

  }

  public catalogModified(event: EmitData) {
   // debugger
    if(event.stateView===StateView.create){
      this.repository.Create(event.catalog)
      this.flag=StateView.default
    }
   if(event.stateView===StateView.edit){
    this.repository.Update(event.catalog)
    this.flag=StateView.default
   }
   if(event.stateView===StateView.exit){
    this.flag=StateView.default
    
   }
   if(event.stateView===StateView.delete){
    this.repository.Delete(event.catalog)
    this.flag=StateView.default
    
    
   }
   
    
  }

 

 

 
  //--------------------

  public onChangedDefaultState() {
    //debugger
    this.flag = StateView.default;
  }

  cancel() {
    this.flag = StateView.default;
    //this._flagDisplayAddButton = true;
  }
}
