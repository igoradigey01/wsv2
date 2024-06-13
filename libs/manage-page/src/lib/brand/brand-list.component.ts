import { Component,computed,signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {EmitData} from './brand-shell.component'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StateView } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Brand } from '@wsv2/app-common';

@Component({
  selector: 'wsv2-brand-list',
  standalone: true,
  imports: [
    
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule
   
  ],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss'],
})
export class BrandListComponent {

  @Output() public brandChange = new EventEmitter<EmitData>();

  private state:Signal<Brand[]> = signal<Brand[]>([]);
  
  private _product_type_of_clientId=1; 
  
   @Input({required:true}) set Items(items:Signal< Brand[]>) {
    
     this.state=items;
   }

   @Input({required:true}) set product_type_of_clientId(items:number) {
    
    this._product_type_of_clientId=items;
  }
 
   
   public  Brands =  computed(()=> {
    //console.log ( 'repository.Brands--brand-list'+JSON.stringify( this.state()))
    
    return this.state()});
   


   changePosition(action:string, item: Brand) {
   // debugger
    if(action==="edit")    
    this.brandChange.emit(<EmitData>{brand:item,stateView:StateView.edit});
    if(action==="delete")
    this.brandChange.emit(<EmitData>{brand:item,stateView:StateView.delete});
    
   

  
  }

  addPosition(){
   // debugger
    this.brandChange.emit(<EmitData>{brand:<Brand>{id:0,name:"",ownerId:"none", product_typeId:this._product_type_of_clientId,hidden:false},stateView:StateView.create});
 
}
    
}
