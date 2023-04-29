import { Component, OnInit } from '@angular/core';
import {KatalogN} from 'apps/xf01/src/app/_shared/_interfaces/katalog-n.model';
import {StateView} from 'apps/xf01/src/app/_shared/_interfaces/state-view';
import { KatalogNService} from '../../shared/services/katalog-n.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Input, Output, EventEmitter } from '@angular/core';

export interface DtoKatalogN {
  katalogN: KatalogN;
  flagViewState: StateView;
}

@Component({
  selector: 'app-katalog-n-item',
  templateUrl: './katalog-n-item.component.html',
  styleUrls: ['./katalog-n-item.component.scss']
})
export class KatalogNItemComponent implements OnInit {


  @Output() public _onChangeStateView = new EventEmitter<StateView>();
  @Output() public _onKatalogNChange = new EventEmitter<DtoKatalogN>();
  @Input() public _select_KatalogN:KatalogN | undefined;
  @Input() public _flagViewState: StateView | undefined;
  @Input() public _select_CategoriaN_ID:number|undefined;

  public _flag_sendServerData: boolean = false;

  public _flagInvalid: boolean = false;

  public _progress: number = 0;

  public _flagButtonShow: boolean = false;
  public _flagError: boolean = false;
  _errorMgs: string[] = [];

  public _showPrefix = true;

  public get IsCreateView(): boolean {
    return this._flagViewState == StateView.create ? false : true;
  }

  constructor(private _repository:KatalogNService) {
    this._select_KatalogN = <KatalogN>{
      id: -1,
      name: '',
      hidden: false,
      decriptSEO:''
    };
  }

  ngOnInit(): void {
    // debugger
  }

  //--------------------------------
  public save(): void {
    this._flagInvalid = true;
    this._flag_sendServerData = true;
    // debugger
    this._errorMgs = [];
    if (this._flagViewState == StateView.create) {
      // --- start create--
      if (this._select_KatalogN) {
        this._select_KatalogN.id = 0;
        if(this._select_CategoriaN_ID)this._select_KatalogN.categoriaId=this._select_CategoriaN_ID;
        

        this._repository.Create(this._select_KatalogN).subscribe(
          (data: HttpEvent<any>) => {
            //progress bar
            switch (data.type) {
              case HttpEventType.Sent:
                //   console.log('Sent-- запрос отправлен--UpdateProduct--'); // запрос отправлен
                break;
              case HttpEventType.UploadProgress:
                // do something
                if (data.total) {
                  this._progress = Math.round((100 * data.loaded) / data.total);
                  //    console.log('HttpEventType.UploadProgress--' + this._progress);
                }
                break;
              case HttpEventType.Response:
                console.log('---Finished-----');
                this._errorMgs = [];
                this._flagError = false;
                let d = <KatalogN>data.body;
                this._onKatalogNChange.emit(<DtoKatalogN>{
                  katalogN: d,
                  flagViewState: StateView.create,
                });
                this.OK();
                break;
            }
            // end progrss bar
          },
          (err: HttpErrorResponse) => {
            this._flagError = true;
            //--  this._flag_sendServerData = false;
            this._flagInvalid = false;
            if (err.status === 401) {
              this._errorMgs.push(
                'пользователь не авторизован,войдите на сайт'
              );
              return;
            }
            if (err.status == 400) {
              console.log(err.error);
              if (err.error.errors) this._errorMgs.push(err.error.errors);
              else this._errorMgs.push(err.error);
              return;
            }

            this._errorMgs.push(
              'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса'
            );
          }
        );

        return;
        //--- end create -------
      }
    }
    if (this._flagViewState == StateView.edit) {
      if (this._select_KatalogN) {
        // ---- start edit -------
        this._repository.Update(this._select_KatalogN).subscribe(
          (data: HttpEvent<any>) => {
            //progress bar
            switch (data.type) {
              case HttpEventType.Sent:
                console.log('Sent-- запрос отправлен--UpdateProduct--'); // запрос отправлен
                break;
              case HttpEventType.UploadProgress:
                // do something
                if (data.total) {
                  this._progress = Math.round((100 * data.loaded) / data.total);
                  console.log(
                    'HttpEventType.UploadProgress--' + this._progress
                  );
                }
                break;
              case HttpEventType.Response:
                console.log('---Finished-----');
                this._errorMgs = [];
                this._flagError = false;
                //03.02.22
                let d = <KatalogN>data.body;
                this._onKatalogNChange.emit(<DtoKatalogN>{
                  katalogN: d,
                  flagViewState: StateView.edit,
                });
                //   window.location.replace(this._select_Product.rootImgSrc+'S'+this._select_Product.imgName+'.web');

                this.OK(); //15.03.21
                break;
            }
            // end progrss bar
          },
          (err: HttpErrorResponse) => {
            this._flagError = true;
            //--  this._flag_sendServerData = false;
            this._flagInvalid = false;

            if (err.status === 401) {
              this._errorMgs.push(
                'пользователь не авторизован,войдите на сайт'
              );
              return;
            }
            if (err.status == 400) {
              console.log(err.error);
              if (err.error.errors) this._errorMgs.push(err.error.errors);
              else this._errorMgs.push(err.error);
              return;
            }

            this._errorMgs.push(
              'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса'
            );
          }
        );
        return;
      }
      //--- end edit ---
    }

    // this._flagInvalid = true; //!!!!
  }

  public deleteK() {
   // debugger
    this._flagInvalid = true;
    this._flag_sendServerData = true;
    // debugger
    this._errorMgs = [];
    this._flagError = false;
    if (this._select_KatalogN) {
      this._repository.Delete(this._select_KatalogN.id).subscribe(
        (data: HttpEvent<any>) => {
          //progress bar
          switch (data.type) {
            case HttpEventType.Sent:
              console.log('Sent-- запрос отправлен--UpdateProduct--'); // запрос отправлен
              break;

            case HttpEventType.Response:
              console.log('---Finished-----');
              this._errorMgs = [];
              this._flagError = false;
             // let d = <KatalogN>data.body;
              this._onKatalogNChange.emit(<DtoKatalogN>{
                katalogN: this._select_KatalogN,
                flagViewState: StateView.delete,
              });

              this.OK(); //15.03.21
              break;
          }
          // end progrss bar
        },
        (err: HttpErrorResponse) => {
          // debugger

          this._flagError = true;
          //--  this._flag_sendServerData = false;
          this._flagInvalid = false;
          if (err.status === 401) {
            this._errorMgs.push('пользователь не авторизован,войдите на сайт');
            return;
          }

          if (err.status == 400) {
            console.log(err.error);
            if (err.error.errors) this._errorMgs.push(err.error.errors);
            else this._errorMgs.push(err.error);
            return;
          }

          this._errorMgs.push(
            'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса'
          );
        }
      );
    }
  }
  public cancel() {
    // debugger
    this._onChangeStateView.emit(StateView.default);
  }

  public undo() {
    //debugger
    this._flag_sendServerData = false;
  }
  public OK() {
    this._onChangeStateView.emit(StateView.default);
  }
}

