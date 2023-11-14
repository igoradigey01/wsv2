import { Component ,computed,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateView } from '@wsv2/app-common';
import { Katalog } from '@wsv2/app-common';
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
  public item=<Katalog>{id:0,name:"none",ownerId:"none",decriptSEO:'',hidden:false};
  

  constructor(
    private repository: KatlogService
    ) {}

 

  //----------------------

 public  onCatalogChange(event:EmitData){
  this.item=event.catalog;
  this.flag=event.stateView;

  }

  public catalogModified(event: EmitData) {
    if(event.stateView===StateView.create){
      this.repository.Create(event.catalog)
    }
   if(event.stateView===StateView.edit){
    this.repository.Update(event.catalog)
   }
   if(event.stateView===StateView.exit){
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
