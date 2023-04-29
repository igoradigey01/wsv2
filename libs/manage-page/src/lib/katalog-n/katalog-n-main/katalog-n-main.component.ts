import { Component, OnInit } from '@angular/core';
import { StateView } from 'apps/xf01/src/app/_shared/_interfaces/state-view';
import { KatalogN } from 'apps/xf01/src/app/_shared/_interfaces/katalog-n.model';
import { KatalogNService } from '../../shared/services/katalog-n.service';
import { DtoKatalogN } from '../katalog-n-item/katalog-n-item.component';
import { CategoriaN } from 'apps/xf01/src/app/_shared/_interfaces/categoria-n.model';
import { KatalogUI } from 'apps/xf01/src/app/ui/shared/_interfaces/katalog.model';

@Component({
  selector: 'app-katalog-n-main',
  templateUrl: './katalog-n-main.component.html',
  styleUrls: ['./katalog-n-main.component.scss'],
})
export class KatalogNMainComponent implements OnInit {
  public _select_katalog: KatalogN = <KatalogN>{
    id: -1,
    name: '',
    hidden: false,
  }; //new Katalog(-1, ''); //выбор Kalog item
  public _katalogNs: KatalogN[] = []; // массив items materialProduct
  public _categoriaNs: CategoriaN[] = [];
  public _selected_categoriaN_ID: number = -1;
  public _selected_categoriaN_Name: string = '';

  public _modul_name: string = '(менеджер)';
  public _router_link: string = '/manager';
  public _flagViewState: StateView = StateView.default;

  constructor(
    private _repository: KatalogNService) {}

  ngOnInit(): void {
    this.loadCategoriaNs();
  }

  //----------------------

  public loadCategoriaNs() {
    this._repository.CategoriaNs().subscribe((d) => (this._categoriaNs = d));
  }

  public onChangeStateView(event: StateView) {
    // debugger
    this._flagViewState = event;
    if (this._flagViewState == StateView.create) {
      this._select_katalog = <KatalogN>{ id: -1, name: '', hidden: false };
    }
  }

  public onChangedViewMode(event: StateView) {
    // debugger
    this._flagViewState = event;
    if (this._flagViewState == StateView.create) {
      this._select_katalog = <KatalogN>{
        id: -1,
        categoriaId: this._selected_categoriaN_ID,
        name: '',
        hidden: false,
      };
    }
  }

  public onChangedCategoriaN(event: KatalogUI) {
    this._flagViewState = StateView.default;
    this._selected_categoriaN_ID = event.id;
    this._selected_categoriaN_Name = event.name;
    this._repository.KatalogNs(event.id).subscribe((d) => {
      this._katalogNs = d;

      // console.log('onChangedCategoriaN');
      // console.log(JSON.stringify(data));
    });
  }

  public onChangedKatalogN(event: DtoKatalogN) {
    //throw new Error("not Implict");


    if (event.flagViewState == StateView.create) {
      if (this._katalogNs) this._katalogNs.push(event.katalogN);
    }
    if (event.flagViewState == StateView.delete) {
      debugger
      if (this._katalogNs) {
        let index = this._katalogNs.findIndex((f) => f.id === event.katalogN.id);
        if(index !=-1)
           this._katalogNs.splice(index,  1);
        // console.log(JSON.stringify( this._products));
      }
    }
  }

  changePosition(item: KatalogN) {
    // debugger
    this._select_katalog = item;

    this._flagViewState = StateView.edit;
    // this._flagDisplayAddButton = false;
  }
  //--------------------

  public onChangedDefaultState() {
    //debugger
    this._flagViewState = StateView.default;
  }

  cancel() {
    this._flagViewState = StateView.default;
    //this._flagDisplayAddButton = true;
  }
}
