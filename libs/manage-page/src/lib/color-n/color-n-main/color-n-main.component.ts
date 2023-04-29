import { Component, OnInit } from '@angular/core';
import {StateView} from 'apps/xf01/src/app/_shared/_interfaces/state-view';

import { ColorNService } from '../../shared/services/color-n.service';
import {Color} from 'apps/xf01/src/app/_shared/_interfaces/color.model';
import {DtoColorN} from '../color-n-item/color-n-item.component'

@Component({
  selector: 'app-color-n-main',
  templateUrl: './color-n-main.component.html',
  styleUrls: ['./color-n-main.component.scss']
})
export class ColorNMainComponent implements OnInit {





  public _select_colorN: Color = <Color>{ id: -1, name: '',hidden:false };; //new Katalog(-1, ''); //выбор Kalog item
  public  _colorNs:Color[] =[]; // массив items katalog
  public _modul_name: string = '(менеджер)';
  public _router_link: string = '/manager';
  public _flagViewState:StateView=StateView.default;

  constructor(private _repository:ColorNService) {}

  ngOnInit(): void {
    this.loadKatalogs();
  }

  //----------------------

public  loadKatalogs() {
    this._repository.ColorNs().subscribe((data) => (this._colorNs = data));
  }

public  onChangeStateView(event:StateView){
 // debugger
    this._flagViewState = event;
    if (this._flagViewState == StateView.create) {
      this._select_colorN = <Color>{ id: -1, name: '', hidden:false };
    }

  }

public  onChangedColorN(event:DtoColorN){
    if(event.flagViewState==StateView.create){
      if(this._colorNs)
      this._colorNs.push(event.colorN);
    }
    if(event.flagViewState==StateView.delete)
    {
      if(this._colorNs){
     let index= this._colorNs.findIndex(f=>f.id==event.colorN.id);
      this._colorNs.splice(index,index+1);
     // console.log(JSON.stringify( this._products));
      }
    }

  }

  changeColorN(item: Color) {
   // debugger
      this._select_colorN = item;

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

