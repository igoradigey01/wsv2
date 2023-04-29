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
import { Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-nomenclature-katalog',
  templateUrl: './nomenclature-katalog.component.html',
  styleUrls: ['./nomenclature-katalog.component.scss']
})
export class NomenclatureKatalogComponent implements OnInit {


   public _nomenclatures: Nomenclature[] = [];
   public _katalogUIs: KatalogUI[]=[];
  // public _flagViewState:StateView=StateView.table;

   @Input() public _katalogNs: KatalogN[] = [];
   @Input() public _articles: Article[] = [];
  @Input() public _colors: Color[] = [];
  @Input() public _brands: Brand[] = [];
  @Input() public  _select_CategoriaN_id:number=-1;
  @Input()  public _select_CategoriaN_name:string='';
  @Input()  public _flagViewState: StateView = StateView.default;
  @Output() _onChangedViewModeNK = new EventEmitter<StateView>();
  @Output() _onChangedKatalogUI = new EventEmitter<KatalogUI>();

  public _select_KatalogN: KatalogN = <KatalogN>{
    id: -1,
    name: '',
    hidden: false,
  };
  public _modul_name: string = '(менеджер)';
  public _router_link: string = '/manager';
  @Input() public _flagAddButton:boolean=false;


  //--------------------------

  public _root_url_img: string = '';
  public _select_Nomenclature: Nomenclature;

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
      description: '',
      guid: '',
    };
  }

  ngOnInit(): void {
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

  public onChangedViewMode(event: StateView) {
    // debugger
    this._flagViewState = event;
  //  this._onChangedViewModeNK.next(this._flagViewState)
    if (this._flagViewState == StateView.create) {
      this._select_Nomenclature =  <Nomenclature>{
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
        description: '',
        guid: '',
      };
    }
  }

  public onChangedKatalogUI(event: KatalogUI) {
    this._flagViewState = StateView.default;
    this._flagAddButton=true;
    this._select_KatalogN.id = event.id;
    this._select_KatalogN.name=event.name;
    this._repository
      .NomenclaturePKs(this._select_KatalogN.id)
      .subscribe((data) => {
        this._nomenclatures = data;
        // console.log('onChangedKatalog');
        // console.log(JSON.stringify(data));
      });
  }

  public onChangeEditNomenrlature(event: Nomenclature) {
    this._select_Nomenclature = event;
    // debugger

    if (this._select_KatalogN.id == this._select_Nomenclature.katalogId) {
      this._select_Nomenclature.katalogName = this._select_KatalogN.name;
     // this._select_Nomenclature.wwwroot = this._repository.WWWroot;
    } else {
      throw new Error('this._selectKatalog.id!=this._select_Product.katalogId');
      // console.log('onChangeRow--' + event.name);
    }
    let itemA = this._articles.find(
      (x) => x.id == this._select_Nomenclature.articleId
    );
    this._select_Nomenclature.articleName =itemA ? itemA.name : '';

    let itemC = this._colors.find(
      (d) => d.id == this._select_Nomenclature.colorId
    );
    this._select_Nomenclature.colorName = itemC ? itemC.name : '' ;

   let itemB=this._brands.find(d=>d.id==this._select_Nomenclature.brandId);
   this._select_Nomenclature.brandName=itemB ? itemB.name : '';
     this._select_Nomenclature.articleName=itemA?.name;
     this._select_Nomenclature.brandName=itemB?.name;
     this._select_Nomenclature.colorName=itemC?.name;

    this._flagViewState = StateView.edit;
  }
  public onBackInKagegorias(){
  //  debugger
    this. _onChangedViewModeNK.next(StateView.default);
  }



}
