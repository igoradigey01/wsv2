import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Input, Output, EventEmitter } from '@angular/core';
import {StateView} from 'apps/xf01/src/app/_shared/_interfaces/state-view';
import { ArticleNService} from     "../../shared/services/article-n.service";                  //' shared/sevices/katalog.service';
import { Article} from 'apps/xf01/src/app/_shared/_interfaces/article.model';


export interface DtoArticleN {
  articleN: Article;
  flagViewState: StateView;
}

@Component({
  selector: 'app-article-n-item',
  templateUrl: './article-n-item.component.html',
  styleUrls: ['./article-n-item.component.scss']
})
export class ArticleNItemComponent implements OnInit {





  @Output() public _onChangeStateView = new EventEmitter<StateView>();
  @Output() public _onArticleNChange = new EventEmitter<DtoArticleN>();
  @Input() public _select_articleN: Article| undefined;
  @Input() public _flagViewState: StateView | undefined;

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

  constructor(
    private _repository:ArticleNService
  ) {
    this._select_articleN=<Article>{id:-1,name:'',hidden:false}
    //<CategoriaN>{id:-1,name:'',roleF:true,roleT:false, flag_href:false,flag_link:false,hidden:false,decriptSEO:'',link:false}
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
      if(this._select_articleN){
        this._select_articleN.id = 0;
      this._repository.Create(this._select_articleN).subscribe(
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
              let d=  <Article>   data.body
                 this._onArticleNChange.emit(
                   <DtoArticleN>{ articleN:d,
                    flagViewState:StateView.create
                   }
                 );
                 this.OK();
              break;
          }
          // end progrss bar
        },
        (err:HttpErrorResponse) => {
          this._flagError = true;
      //--  this._flag_sendServerData = false;
        this._flagInvalid = false;
        if(err.status === 401){
          this._errorMgs.push("пользователь не авторизован,войдите на сайт")
          return;
        }
        if ( err.status == 400) {
          console.log(err.error);
          if (err.error.errors)
            this._errorMgs.push(err.error.errors);
          else
            this._errorMgs.push(err.error);
          return;
        }

        this._errorMgs.push('Ошибка {'+err.status+ '} -Сообщиете Администаратору Pесурса');

        }
      );

      return;
      //--- end create -------
      }
    }
    if (this._flagViewState == StateView.edit) {

      if(this._select_articleN){
      // ---- start edit -------
      this._repository.Update(this._select_articleN).subscribe(
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
                console.log('HttpEventType.UploadProgress--' + this._progress);
              }
              break;
            case HttpEventType.Response:
              console.log('---Finished-----');
              this._errorMgs =[];
              this._flagError = false;
              //03.02.22
              let d=  <Article>   data.body
              this._onArticleNChange.emit(
                <DtoArticleN>{ articleN:d,
                 flagViewState:StateView.edit
                }
              );
              //   window.location.replace(this._select_Product.rootImgSrc+'S'+this._select_Product.imgName+'.web');

              this.OK(); //15.03.21
              break;
          }
          // end progrss bar
        },
        (err:HttpErrorResponse) => {
          this._flagError = true;
          //--  this._flag_sendServerData = false;
            this._flagInvalid = false;

            if(err.status === 401){
              this._errorMgs.push("пользователь не авторизован,войдите на сайт")
              return;
            }
            if ( err.status == 400) {
              console.log(err.error);
              if (err.error.errors)
                this._errorMgs.push(err.error.errors);
              else
                this._errorMgs.push(err.error);
              return;
            }

            this._errorMgs.push('Ошибка {'+err.status+ '} -Сообщиете Администаратору Pесурса');

        }
      );
      return;
      }
      //--- end edit ---
    }

    // this._flagInvalid = true; //!!!!
  }

  public delete() {
    this._flagInvalid = true;
    this._flag_sendServerData = true;
     // debugger
    this._errorMgs = [];
    this._flagError = false;
    if(this._select_articleN){
    this._repository.Delete(this._select_articleN.id).subscribe(
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
         //   let d=  <Katalog>   data.body
            this._onArticleNChange.emit(
              <DtoArticleN>{ articleN:this._select_articleN, //21.03.22
               flagViewState:StateView.delete
              }
            );
            this.OK();; //15.03.21
            break;
        }
        // end progrss bar
      },
      (err : HttpErrorResponse) => {
       // debugger

        this._flagError = true;
      //--  this._flag_sendServerData = false;
        this._flagInvalid = false;
        if(err.status === 401){
          this._errorMgs.push("пользователь не авторизован,войдите на сайт")
          return;
        }

        if ( err.status == 400) {
          console.log(err.error);
          if (err.error.errors)
            this._errorMgs.push(err.error.errors);
          else
            this._errorMgs.push(err.error);
          return;
        }

        this._errorMgs.push('Ошибка {'+err.status+ '} -Сообщиете Администаратору Pесурса');
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
  public OK(){
   this._onChangeStateView.emit(StateView.default);

  }


}

