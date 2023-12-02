import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { StateView } from '@wsv2/app-common';
import { SubKatalog,Katalog } from '@wsv2/app-common';
import {KatlogService,SubKatalogService } from '@wsv2/shop-content';
import {SubCatalogItemComponent} from './sub-catalog-item.component';
import {SubCatalogListComponent } from './sub-catalog-list.component'

export enum StateView {
  default=0, 
  catalogVeiw=1,
  subCatalogView=2,
  itemView=3, 
  edit=4,
  create=5, 
  wait=6, // ожидание 
  delete=7,
  exit=8
 
}



export interface EmitData{
  catalog:Katalog,
  subCatalog:SubKatalog,
  stateView:StateView
}

@Component({
  selector: 'wsv2-sub-catalog-shell',
  standalone: true,
  imports: [
    CommonModule,
    SubCatalogItemComponent,
    SubCatalogListComponent
  ],
  templateUrl: './sub-catalog-shell.component.html',
  styleUrls: ['./sub-catalog-shell.component.scss'],
})
export class SubCatalogShellComponent {


  public flag=StateView.default;

  public catalogs = this.repositoryCatalog.Katalogs;
  public subCatalogs=computed(() => this.repositorySubCatalog.SubCatalogs());

  public message=this.repositorySubCatalog.Message;
   
  public item=<SubKatalog>{id:0,name:"none",ownerId:"none",catalogId:0,GoogleTypeId:"", decriptSeo:'',hidden:false};
  



  constructor(
    private repositoryCatalog: KatlogService,
    private repositorySubCatalog:SubKatalogService
    ) {

      repositoryCatalog.ClearMessage();
    }


    public  onCatalogChange(event:EmitData){
      this.subCatalogs=computed(()=>this.repositorySubCatalog.SubCatalogs().filter(d=>d.catalogId===event.catalog.id))
     
      this.flag=event.stateView;
    
      }

      public  onSubCatalogChange(event:EmitData){
        this.item=event.subCatalog;
        this.flag=event.stateView;
      
        }
        
    
      public catalogModified(event: EmitData) {
       // debugger
        if(event.stateView===StateView.create){
          this.repositorySubCatalog.Create(event.subCatalog)
          this.flag=StateView.default
        }
       if(event.stateView===StateView.edit){
        this.repositorySubCatalog.Update(event.subCatalog)
        this.flag=StateView.default
       }
       if(event.stateView===StateView.exit){
        this.flag=StateView.default
        
       }
       if(event.stateView===StateView.delete){
        this.repositorySubCatalog.Delete(event.subCatalog)
        this.flag=StateView.default
        
        
       }
       
        
      }
    

}
