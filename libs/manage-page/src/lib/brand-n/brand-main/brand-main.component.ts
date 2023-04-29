import { Component, OnInit } from '@angular/core';
import {StateView} from 'apps/xf01/src/app/_shared/_interfaces/state-view';

import { BrandNService } from '../../shared/services/brand-n.service';
import { Brand} from 'apps/xf01/src/app/_shared/_interfaces/brand.model';
import {DtoBarndN} from '../brand-item/brand-item.component'

@Component({
  selector: 'app-brand-main',
  templateUrl: './brand-main.component.html',
  styleUrls: ['./brand-main.component.scss']
})
export class BrandMainComponent implements OnInit {



  public _select_brandN: Brand = <Brand>{ id: -1, name: '',hidden:false };; //new Katalog(-1, ''); //выбор Kalog item
  public  _brandNs:Brand[] =[]; // массив items katalog
  public _modul_name: string = '(менеджер)';
  public _router_link: string = '/manager';
  public _flagViewState:StateView=StateView.default;

  constructor(private _repository: BrandNService) {}

  ngOnInit(): void {
    this.loadKatalogs();
  }

  //----------------------

public  loadKatalogs() {
    this._repository.BrandNs().subscribe((data) => (this._brandNs = data));
  }

public  onChangeStateView(event:StateView){
// debugger
    this._flagViewState = event;
    if (this._flagViewState == StateView.create) {
      this._select_brandN = <Brand>{ id: -1, name: '', hidden:false };
    }

  }

public  onChangedBrandN(event:DtoBarndN){
    if(event.flagViewState==StateView.create){
      if(this._brandNs)
      this._brandNs.push(event.brandN);
    }
    if(event.flagViewState==StateView.delete)
    {
      if(this._brandNs){
     let index= this._brandNs.findIndex(f=>f.id==event.brandN.id);
      this._brandNs.splice(index,index+1);
     // console.log(JSON.stringify( this._products));
      }
    }

  }

  changeBrandN(item: Brand) {
   // debugger
      this._select_brandN = item;

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

