import { Component, OnInit } from '@angular/core';
import {StateView} from 'apps/xf01/src/app/_shared/_interfaces/state-view';

import { ArticleNService} from '../../shared/services/article-n.service';
import {Article} from 'apps/xf01/src/app/_shared/_interfaces/article.model';
import {DtoArticleN} from '../article-n-item/article-n-item.component'


@Component({
  selector: 'app-article-n-main',
  templateUrl: './article-n-main.component.html',
  styleUrls: ['./article-n-main.component.scss']
})
export class ArticleNMainComponent implements OnInit {






  public _select_articleN: Article = <Article>{ id: -1, name: '',hidden:false };; //new Katalog(-1, ''); //выбор Kalog item
  public  _articleNs:Article[] =[]; // массив items katalog
  public _modul_name: string = '(менеджер)';
  public _router_link: string = '/manager';
  public _flagViewState:StateView=StateView.default;

  constructor(private _repository:ArticleNService) {}

  ngOnInit(): void {
    this.loadKatalogs();
  }

  //----------------------

public  loadKatalogs() {
    this._repository.ArticleNs().subscribe((data) => (this._articleNs = data));
  }

public  onChangeStateView(event:StateView){
 // debugger
    this._flagViewState = event;
    if (this._flagViewState == StateView.create) {
      this._select_articleN = <Article>{ id: -1, name: '', hidden:false };
    }

  }

public  onChangedArticleN(event:DtoArticleN){
    if(event.flagViewState==StateView.create){
      if(this._articleNs)
      this._articleNs.push(event.articleN);
    }
    if(event.flagViewState==StateView.delete)
    {
      if(this._articleNs){
     let index= this._articleNs.findIndex(f=>f.id==event.articleN.id);
      this._articleNs.splice(index,index+1);
     // console.log(JSON.stringify( this._products));
      }
    }

  }

  changeArticleN(item: Article) {
   // debugger
      this._select_articleN = item;

    this._flagViewState = StateView.edit;
   // this._flagDisplayAddButton = false;
  }
  //--------------------


  public onChangedDefaultState(){
    //debugger
    this._flagViewState = StateView.default;
  }






  cancel() {
    this._flagViewState =StateView.default;
    //this._flagDisplayAddButton = true;
  }



}


