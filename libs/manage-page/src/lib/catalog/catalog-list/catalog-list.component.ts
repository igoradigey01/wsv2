import { Component,signal,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Katalog } from '@wsv2/app-common';
import { StateView } from '@wsv2/app-common';
import {EmitData} from '../catalog-shell/catalog-shell.component'



@Component({
  selector: 'wsv2-catalog-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule
   
  ],
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss'],
})
export class CatalogListComponent {

  
  @Output() public catalogChange = new EventEmitter<EmitData>();

  private state = signal<Katalog[]>([]);

   
  
   @Input() set Items(item: Katalog[]) {
    
     this.state.update(()=>item);
   }
 
   
   public  Katalogs = computed(() => this.state());
   


   changePosition(action:string, item: Katalog) {
   // debugger
    if(action==="edit")    
    this.catalogChange.emit(<EmitData>{catalog:item,stateView:StateView.edit});
    if(action==="delete")
    this.catalogChange.emit(<EmitData>{catalog:item,stateView:StateView.delete});
    
   

  
  }

  addPosition(){
   // debugger
    this.catalogChange.emit(<EmitData>{catalog:<Katalog>{id:0,name:'',hidden:false,decriptSEO:"",ownerId:"none"},stateView:StateView.create});
 
}
}
