import { Component, OnInit } from '@angular/core';
import { NomenclatureService } from '../../shared/services/nomenclature.service';
import { Nomenclature } from 'apps/xf01/src/app/_shared/_interfaces/nomenclature.model';
import { KatalogN } from 'apps/xf01/src/app/_shared/_interfaces/katalog-n.model';
import { Color } from 'apps/xf01/src/app/_shared/_interfaces/color.model';
import { Brand } from 'apps/xf01/src/app/_shared/_interfaces/brand.model';
import { Article } from 'apps/xf01/src/app/_shared/_interfaces/article.model';
import { StateView } from 'apps/xf01/src/app/_shared/_interfaces/state-view';
import { ImgManagerService } from 'apps/xf01/src/app/_shared/services/img-manager.service';
import { DtoNomenclature } from '../nomenclature-item/nomenclature-item.component';
import { KatalogUI } from 'apps/xf01/src/app/ui/shared/_interfaces/katalog.model';
import { CategoriaN } from 'apps/xf01/src/app/_shared/_interfaces/categoria-n.model';
import {DtoCategoriaN} from './../../categoria-n_/categoria-n-item/categoria-n-item.component'

@Component({
  selector: 'app-nomenclature-main',
  templateUrl: './nomenclature-main.component.html',
  styleUrls: ['./nomenclature-main.component.scss'],
})
export class NomenclatureMainComponent implements OnInit {
  public _nomenclatures: Nomenclature[] = [];
  public _katalogUIs: KatalogUI[]=[];
  public _categoriaNs:CategoriaN[]=[];
  public _katalogNs: KatalogN[] = [];
  public _articles: Article[] = [];
  public _colors: Color[] = [];
  public _brands: Brand[] = [];
  public  _select_CategoriaN_id:number=-1;
  public _select_CategoriaN_name:string='';

  public _select_KatalogN: KatalogN = <KatalogN>{
    id: -1,
    name: '',
    hidden: false,
  };

  public _select_Nomenclature:Nomenclature;
  public _modul_name: string = '(менеджер)';
  public _router_link: string = '/manager';
  public _flagViewState: StateView = StateView.default;

  //--------------------------

  public _wwwroot: string = '';


  /** this new version product view */
  constructor(
    private _repository: NomenclatureService,
    private _imgConverter: ImgManagerService
  ) {
    this._select_Nomenclature = <Nomenclature>{
      id: -1,
      name: '',
      katalogId: -1,
      articleId: -1,
      brandId: -1,
      colorId: -1,
      position:0,
      hidden: false,
      markup: 20,
      price: -1,
      sale:false,
      inStock:true,
      description: '',
      guid: '',
    };
  }

  ngOnInit(): void {
    this._repository.CategoriaNs().subscribe((data) => {
      this._categoriaNs = data;
    });
    this._repository.ArticleNs().subscribe((data) => {
      this._articles = data;
    });
    this._repository.ColorNs().subscribe((data) => {
      this._colors = data;
    });
    this._repository.BrandNs().subscribe((data) => {
      this._brands = data;
    });



  }
  public onChangedNomenclature(event: DtoNomenclature) {
    if (event.flagViewState == StateView.create) {
      // debugger
      this._nomenclatures.push(event.nomenclature);
    }
    if (event.flagViewState == StateView.delete) {
      let index = this._nomenclatures.findIndex((f) => f.id == event.nomenclature.id);
      this._nomenclatures.splice(index, index + 1);
      // console.log(JSON.stringify( this._products));
    }
  }

  public onChangedViewModeMain(event: StateView) {
  //  debugger
    this._flagViewState = event;


  }

  public onChangedKatalogUI(event: KatalogUI) {
    debugger
    this._flagViewState = StateView.default;
    this._select_KatalogN.id = event.id;
    this._select_KatalogN.name=event.name;
    this._repository
      .NomenclaturePKs(this._select_KatalogN.id)
      .subscribe((data) => {
        this._nomenclatures = data;
        // console.log('onChangedKatalog');
        // console.log(JSON.stringify(data));
      });
   //   console.log(JSON.stringify(this._nomenclatures));
  }

  public onChangeCategoriaN(event:DtoCategoriaN) {
    //  debugger
    this._select_CategoriaN_id = event.categoriaN.id;
    this._select_CategoriaN_name=event.categoriaN.name;
    this._repository.KatalogNs(this._select_CategoriaN_id).subscribe(
      d=>{this._katalogNs=d;}
    )
    this._flagViewState=event.flagViewState;

  }


}
