import { Component, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { FormsModule } from '@angular/forms';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { Article } from '@wsv2/app-common';
import {ProductType} from '../_shared/interfaces/product_type.model' 
import { EmitData } from './article-shell.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StateView } from '@wsv2/app-common';

import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wsv2-article-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,

    FormsModule,
  ],
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss'],
})
export class ArticleItemComponent {

  private state = signal<Article>(<Article>{
    id: 0,
    ownerId: 'none',
    name: '',
    product_typeId:2,
    hidden: false, 
  });
  private _falg = StateView.edit;

  private _product_typeIds:Signal< ProductType[]>=signal<ProductType[]>([]);;

  @Output() public catalogModified = new EventEmitter<EmitData>();

  @Input({required:true}) set Item(item: Article) {
 
    this.state.update(() => item);
  }

  @Input({ required: true }) set flag(stateView: StateView) {
    this._falg = stateView;
  }

  @Input({ required: true }) set product_typeIds(items: Signal< ProductType[]>) {
    this._product_typeIds =items;
  }


  public Article = computed(() => this.state());
  public ProductTypes=computed(()=>this._product_typeIds());

  //--------------------------------
  public save(): void {
    //debugger
    this.catalogModified.emit(<EmitData>{
      article: this.Article(),
      stateView: this._falg,
    });
  }

  public cancel() {
    // debugger
    this.catalogModified.emit(<EmitData>{
      article: this.Article(),
      stateView: StateView.exit,
    });
  }
}
