import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StateView } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Article } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {ArticleService } from '../_shared/services/article.service';
import {ProductTypeService} from '../_shared/services/product_type.service'
import {ArticleListComponent} from './article-list.component'
import {ArticleItemComponent} from './article-item.component'

export interface EmitData{
  article:Article,
  stateView:StateView
}

@Component({
  selector: 'wsv2-article-shell',
  standalone: true,
  imports: [
    CommonModule,
    ArticleItemComponent,
    ArticleListComponent
  ],
  templateUrl: './article-shell.component.html',
  styleUrls: ['./article-shell.component.scss'],
})
export class ArticleShellComponent {
  public flag=StateView.default;

  public articles = this.repository.Articles; 

  public product_typeIds=this.repositoryProductType.ProductTypes;

  public message=this.repository.Message;
   
  public item=<Article>{id:0,name:"",ownerId:"none", product_typeId:2,hidden:false};
  

  constructor(
    private repository: ArticleService,
    private repositoryProductType:ProductTypeService
    ) {

      console.log (repositoryProductType.ProductTypes())
      repository.ClearMessage();
    }

 

  //----------------------

 public  onArticleChange(event:EmitData){
  this.item=event.article;
  this.flag=event.stateView;

  }

  public articleModified(event: EmitData) {
   // debugger
    if(event.stateView===StateView.create){
      this.repository.Create(event.article)
      this.flag=StateView.default
    }
   if(event.stateView===StateView.edit){
    this.repository.Update(event.article)
    this.flag=StateView.default
   }
   if(event.stateView===StateView.exit){
    this.flag=StateView.default
    
   }
   if(event.stateView===StateView.delete){
    this.repository.Delete(event.article)
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
