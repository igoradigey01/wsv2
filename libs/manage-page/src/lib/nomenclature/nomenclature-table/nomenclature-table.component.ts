import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Color } from 'apps/xf01/src/app/_shared/_interfaces/color.model';
import { Brand } from 'apps/xf01/src/app/_shared/_interfaces/brand.model';
import { Article } from 'apps/xf01/src/app/_shared/_interfaces/article.model';
import { Nomenclature } from 'apps/xf01/src/app/_shared/_interfaces/nomenclature.model';
import { EventEmitter, Input, Output } from '@angular/core';
// import { DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { DtoFilterN } from 'apps/xf01/src/app/ui-front/filter-n/filter-n.component';
import { StateView } from 'apps/xf01/src/app/_shared/_interfaces/state-view';
import { NomenclatureService } from '../../shared/services/nomenclature.service';
import { PriceN } from '../../shared/_interfaces/price-n.model';


interface NomenclatureP extends Nomenclature {
  check?: boolean;
}



@Component({
  selector: 'app-nomenclature-table',
  templateUrl: './nomenclature-table.component.html',
  styleUrls: ['./nomenclature-table.component.scss']
})
export class NomenclatureTableComponent implements OnInit {

  @Input() public _nomenclatures: Nomenclature[] = [];
  @Input() public _articles: Article[] = [];
  @Input() public _brands: Brand[] = [];
  @Input() public _colors: Color[] = [];
  @Output() public _onChangeRow = new EventEmitter<Nomenclature>()
  /** flag  используется только в  NomenclatureTableComponent */
  public _flagViewState: StateView = StateView.default; // только для этого NomenclatureTableComponent

  public _viewNomenclatrues: NomenclatureP[] = [];

  public _price: string | undefined;
  public _error:string|undefined;

  constructor(
    //  private sanitizer: DomSanitizer
    private _repository: NomenclatureService
  ) { }

  ngOnInit(): void {
    /*   this._viewNomenclatrues=[...this._nomenclatures];
    console.log(JSON.stringify(this._viewNomenclatrues)); */

  }
  ngOnChanges(changes: SimpleChanges) {
    this._nomenclatures.forEach(i => {
      i.articleName = this._articles.find(d => d.id === i.articleId)?.name;
      i.brandName = this._brands.find(d => d.id === i.brandId)?.name;
      i.colorName = this._colors.find(d => d.id === i.colorId)?.name;
    })

    this._viewNomenclatrues = [...this._nomenclatures];
    // console.log(changes)
  }

  public ImgObj(nomenclature: Nomenclature): string {

    let root = nomenclature.wwwroot ? nomenclature.wwwroot : '';
    root = root + 'S' + nomenclature.guid + '.webp';
    // console.log(root);
    if (!nomenclature.wwwrootOK) {
      return root;


    }

    else {
      /*  let safeUrl=  this.sanitizer.bypassSecurityTrustResourceUrl( URL.createObjectURL(nomenclature.imageWebp));
         console.log(safeUrl) */
      //console.log(nomenclature.imageBase64)
      let timestamp = new Date().getTime();
      let queryString = "?t=" + timestamp;
      return root + queryString;
    }
  }

  public onFilterNomenclatureChange(event: DtoFilterN) {
    // console.log(JSON.stringify(event.nomenclatures))
    console.log(event.nomenclatures.length);
    if (event.flag === true) {
      this._viewNomenclatrues = event.nomenclatures;
    }


  }

  public onChangeViewRender() {
    if (this._flagViewState === StateView.imageTable)
      this._flagViewState = StateView.dataTable
    else this._flagViewState = StateView.imageTable
  }

  public onChangePriceEditChecks() {
    if (this._flagViewState === StateView.priceEdit)
      this._flagViewState = StateView.dataTable
    else this._flagViewState = StateView.priceEdit

  }

  public onSetDataPrice() {
    if (this._price) {
      if (this._viewNomenclatrues.length > 0) {
       // console.log("--onSetDataPrice--")
       let items:PriceN[]=[];
       let price:number=+this._price;

       this._viewNomenclatrues.forEach(
         item=>items.push(<PriceN>{id:item.id,price:price})
       )

       this.setDataPrice(items);
      }
    }
  }

  public changeNomenclature(nomenclature: Nomenclature) {
    //  console.log(" changeProduct(product: Product-)"+product.name+"||imgName--"+ product.rootImgSrc+ "|"  +product.imgName);
    //  debugger
    /* console.log(" changeNomenclature");
    console.log(JSON.stringify(nomenclature)); */
    this._onChangeRow.emit(nomenclature);

  }

  public onCansel(){

    this._flagViewState=StateView.priceEdit;
  }

  private setDataPrice(items:PriceN[]){
    this._flagViewState=StateView.wait;
    this._error=undefined;

    this._repository.UpdatePrice(items).subscribe(
      d=>{

             console.log(d.id+"-------setDataPrice"+d.price);

            // this._nomenclatures.find(n=>n.id===d.id)!.price=+this._price!;
            // this._viewNomenclatrues.find(n=>n.id==d.id)!.price=+this._price!;


          },
         err=>{
           if(err.status===500){
           this._error= "Старус:"+err.status+"--"+ "Ошибка:"+err.message;
           console.log(err);
           return;
           }

           if (err.status === 401) {
            this._error="Старус:"+err.status+"--"+'пользователь не авторизован,войдите на сайт';
            return;
          }
          if (err.status == 400) {
            this._error="Старус:"+err.status+"--"+"Ошибка:"+err.error;
            return;
          }
           console.log(err);
         },
         ()=>{
           items.forEach(
             d=>{
              this._nomenclatures.find(n=>n.id===d.id)!.price=+this._price!;
               this._viewNomenclatrues.find(n=>n.id==d.id)!.price=+this._price!;
             }
           )
              this._flagViewState=StateView.dataTable;
         }

    )

  }
}
