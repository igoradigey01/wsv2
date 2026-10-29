import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import type { Signal } from '@angular/core';

import { Input, Output, EventEmitter } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { SubKatalog,Katalog } from '@wsv2/app-common';
import { EmitData ,StateView} from './sub-catalog-shell.component';

@Component({
    selector: 'wsv2-sub-catalog-list',
    imports: [
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule
],
    templateUrl: './sub-catalog-list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./sub-catalog-list.component.scss']
})
export class SubCatalogListComponent {

  @Output() public catalogChange = new EventEmitter<EmitData>();

  private state:Signal<SubKatalog[]> = signal<SubKatalog[]>([]);
 
  private catalog=<Katalog>{
    id: 0,
    hidden: false,
     decriptSeo: '',
    name: 'none',
    ownerId: 'none',
  };

   
  
   @Input({required:true}) set Items(items: Signal< SubKatalog[]> ) {
    
     this.state=items;
   }

   @Input() set Catalog(item: Katalog) {
    //debugger
    this.catalog=item;
  }
 
   
   public SubKatalogs = computed(() => this.state());
   


   changePosition(action:string, item: SubKatalog) {
   // debugger
    if(action==="edit")    
    this.catalogChange.emit(<EmitData>{subCatalog:item,catalog:this.catalog, stateView:StateView.edit});
    if(action==="delete")
    this.catalogChange.emit(<EmitData>{subCatalog:item,catalog:this.catalog,stateView:StateView.delete});
    
   

  
  }

  addPosition(){
   // debugger
    this.catalogChange.emit(<EmitData>{
      subCatalog:<SubKatalog>{ 
        id:0,
        catalogId: this.catalog.id,
        hidden: false,
        name: '',
        ownerId: this.catalog.ownerId,
        decriptSeo: '',
        GoogleTypeId: '',},stateView:StateView.create});
 
}
}
