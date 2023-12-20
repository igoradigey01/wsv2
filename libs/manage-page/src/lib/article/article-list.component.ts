import { Component,computed,signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {EmitData} from './article-shell.component'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StateView } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Article } from '@wsv2/app-common';

@Component({
  selector: 'wsv2-article-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule
   
  ],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent {

  
    
  @Output() public articleChange = new EventEmitter<EmitData>();

  private state:Signal<Article[]> = signal<Article[]>([]);
  
   
  
   @Input({required:true}) set Items(items:Signal< Article[]>) {
    
     this.state=items;
   }
 
   
   public  Articles =  computed(()=>  this.state());
   


   changePosition(action:string, item: Article) {
   // debugger
    if(action==="edit")    
    this.articleChange.emit(<EmitData>{article:item,stateView:StateView.edit});
    if(action==="delete")
    this.articleChange.emit(<EmitData>{article:item,stateView:StateView.delete});
    
   

  
  }

  addPosition(){
   // debugger
    this.articleChange.emit(<EmitData>{article:<Article>{id:0,name:"none",ownerId:"none", product_typeId:2,hidden:false},stateView:StateView.create});
 
}
    
}
