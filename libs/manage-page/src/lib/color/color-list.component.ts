import { Component,computed,signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {EmitData} from './color-shell.component'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StateView } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Color } from '@wsv2/app-common';

@Component({
  selector: 'wsv2-color-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss'],
})
export class ColorListComponent {

  @Output() public сolorChange = new EventEmitter<EmitData>();

  private state:Signal<Color[]> = signal<Color[]>([]);
  
  private _product_type_of_clientId=1; 
  
   @Input({required:true}) set Items(items:Signal< Color[]>) {
    
     this.state=items;
   }

   @Input({required:true}) set product_type_of_clientId(items:number) {
    
    this._product_type_of_clientId=items;
  }
 
   
   public  Colors =  computed(()=> {
    //console.log ( 'repository.Colors--Color-list'+JSON.stringify( this.state()))
    
    return this.state()});
   


   changePosition(action:string, item: Color) {
   // debugger
    if(action==="edit")    
    this.сolorChange.emit(<EmitData>{color:item,stateView:StateView.edit});
    if(action==="delete")
    this.сolorChange.emit(<EmitData>{color:item,stateView:StateView.delete});
    
   

  
  }

  addPosition(){
   // debugger
    this.сolorChange.emit(<EmitData>{color:<Color>{id:0,name:"",ownerId:"none", product_typeId:this._product_type_of_clientId,hidden:false},stateView:StateView.create});
 
}
}
