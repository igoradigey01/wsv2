import { Component ,signal,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { SubKatalog,Katalog } from '@wsv2/app-common';
import { EmitData ,StateView} from './sub-catalog-shell.component';

@Component({
  selector: 'wsv2-sub-catalog-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sub-catalog-list.component.html',
  styleUrls: ['./sub-catalog-list.component.scss'],
})
export class SubCatalogListComponent {

  @Output() public catalogChange = new EventEmitter<EmitData>();

  private state = signal<SubKatalog[]>([]);
  private _catalog=<Katalog>{
    id: 0,
    hidden: false,
     decriptSeo: '',
    name: 'none',
    ownerId: 'none',
  };

   
  
   @Input() set Items(item: SubKatalog[]) {
    
     this.state.update(()=>item);
   }

   @Input() set Catalog(item: Katalog) {
    this._catalog=item;
  }
 
   
   public  Katalogs = computed(() => this.state());
   


   changePosition(action:string, item: SubKatalog) {
   // debugger
    if(action==="edit")    
    this.catalogChange.emit(<EmitData>{subCatalog:item,catalog:this._catalog, stateView:StateView.edit});
    if(action==="delete")
    this.catalogChange.emit(<EmitData>{subCatalog:item,catalog:this._catalog,stateView:StateView.delete});
    
   

  
  }

  addPosition(){
   // debugger
    this.catalogChange.emit(<EmitData>{subCatalog:<SubKatalog>{id:0,catalogId:this._catalog.id,GoogleTypeId:'' ,name:'',hidden:false, decriptSeo:'',ownerId:this._catalog.ownerId},stateView:StateView.create});
 
}
}
