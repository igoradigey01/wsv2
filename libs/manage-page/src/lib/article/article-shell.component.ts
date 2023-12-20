import { Component, computed ,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StateView } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Article } from '@wsv2/app-common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ArticleService } from '../_shared/services/article.service';
import { ProductTypeService } from '../_shared/services/product_type.service';
import { ArticleListComponent } from './article-list.component';
import { ArticleItemComponent } from './article-item.component';
import { MatSelectModule } from '@angular/material/select';

import { ActivatedRoute } from '@angular/router';


export interface EmitData {
  article: Article;
  stateView: StateView;
}

@Component({
  selector: 'wsv2-article-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    ArticleItemComponent,
    ArticleListComponent,
  ],
  templateUrl: './article-shell.component.html',
  styleUrls: ['./article-shell.component.scss'],
})
export class ArticleShellComponent {

  private state_selected=signal(1);

  public flag = StateView.default;
  public selected_product_typeId = this.state_selected();
   
  //public selected_product_type =computed(()=>this.selected_product_typeId)

  public articles = computed(() => {
    console.log('selected_product_typeId---' + this.state_selected());
    return this.repository
      .Articles()
      .filter((f) => f.product_typeId === this.state_selected());
  });

  public product_typeIds = this.repositoryProductType.ProductTypes;

  public message = this.repository.Message;

  public item = <Article>{
    id: 0,
    name: '',
    ownerId: 'none',
    product_typeId: 2,
    hidden: false,
  };

  constructor(
    private route: ActivatedRoute,
    private repository: ArticleService,
    private repositoryProductType: ProductTypeService
  ) {
    this.route.data.subscribe((v) => {
      this.state_selected.update(()=>+v['type_product']) ;
    }); 

    //console.log (repositoryProductType.ProductTypes())
    repository.ClearMessage();
  }

  //----------------------

  public onArticleChange(event: EmitData) {
    this.item = event.article;
    this.flag = event.stateView;
  }

  public articleModified(event: EmitData) {
    // debugger
    if (event.stateView === StateView.create) {
      this.repository.Create(event.article);
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.edit) {
      this.repository.Update(event.article);
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.exit) {
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.delete) {
      this.repository.Delete(event.article);
      this.flag = StateView.default;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public doSomething(evnt:any){
  

  // console.log( evnt.value);
   this.state_selected.update(()=> evnt.value) 
     console.log("this.articles--"+JSON.stringify(this.articles()))

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
