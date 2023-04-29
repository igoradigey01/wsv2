import { Component, OnInit } from '@angular/core';
import {StateView} from 'apps/xf01/src/app/_shared/_interfaces/state-view';

import { CategoriaNService } from '../../shared/services/categoria-n.service';
import { CategoriaN} from 'apps/xf01/src/app/_shared/_interfaces/categoria-n.model';
import {DtoCategoriaN} from '../categoria-n-item/categoria-n-item.component'


@Component({
  selector: 'app-categoria-n-main',
  templateUrl: './categoria-n-main.component.html',
  styleUrls: ['./categoria-n-main.component.scss'],
})
export class CategoriaNMainComponent implements OnInit {

  public _select_categoriaN: CategoriaN = <CategoriaN>{ id: -1, name: '',flag_href:false,flag_link:false,hidden:false };; //new Katalog(-1, ''); //выбор Kalog item
  public  _categoriaNs: CategoriaN[] | undefined ; // массив items katalog
  public _modul_name: string = '(менеджер)';
  public _router_link: string = '/manager';
  public _flagViewState:StateView=StateView.default;

  constructor(private _repository: CategoriaNService) {}

  ngOnInit(): void {
    this.loadKatalogs();
  }

  //----------------------

public  loadKatalogs() {
    this._repository.CategoriaNs().subscribe((data) => (this._categoriaNs = data));
  }

public  onChangeStateView(event:StateView){
 // debugger
    this._flagViewState = event;
    if (this._flagViewState == StateView.create) {
      this._select_categoriaN = <CategoriaN>{ id: -1, name: '', postavchikId:-1,link:'',flag_href:false,flag_link:false,hidden:false };
    }

  }

public  onChangedCategoriaN(event:DtoCategoriaN){
    if(event.flagViewState==StateView.create){
      if(this._categoriaNs)
      this._categoriaNs.push(event.categoriaN);
    }
    if(event.flagViewState==StateView.delete)
    {
      if(this._categoriaNs){
     let index= this._categoriaNs.findIndex(f=>f.id==event.categoriaN.id);
      this._categoriaNs.splice(index,index+1);
     // console.log(JSON.stringify( this._products));
      }
    }

  }

  changeCategoriaN(item: CategoriaN) {
   // debugger
      this._select_categoriaN = item;

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
