import { Component} from '@angular/core';
//import { Product } from './../shared/_interfaces/product.model';
import { EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {
  //CropperPosition,
  Dimensions,
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform
} from 'ngx-image-cropper';

import { ImgManagerService } from './img-manager.service';


export interface DtoImage {
  base64Img: string;
  flagChanged: boolean;
}

@Component({
  selector: 'wsv2-img-render',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    ImageCropperComponent
  ],
  templateUrl: './img-render.component.html',
  styleUrls: ['./img-render.component.scss'],
})
export class ImgRenderComponent  {
  @Input() public _img_name: string | undefined;
  @Input() public _rootSrc: string | undefined; //='not_found.png';
  @Output() public _onChangedDtoImage = new EventEmitter<DtoImage>();
  @Output() public _onFlagShowSaveDataBar = new EventEmitter<boolean>();

  public _img_cropped: any = '';
  public _imageChanged: any = '';
  public _imageBase64:string|undefined;
  public _flagShowUrl=false;

  public _messagess_show: string | undefined;
  public _flagError = false;
  public _loading = false;

  public _flagPhoto= false;

  public _index_tabs= 0;

  public _transform: ImageTransform = {};
  public _scale = 1;

  public _rotation = 0;
  public _canvasRotation = 0;
  private _i_canvasRotation = 0;
  public _aspectRatio = 1 / 1;
  public _show_aspectRatio = '1/ 1';
  private _i_aspectRatio = 0;
  public _containWithinAspectRatio = false;
  public _maintainAspectRatio = true;

  public _size_h = 0;
  public _size_w= 0;

  public _cropped_size_h = 0;
  public _cropped_size_w = 0;
  public _resizeToWidth = 1080;

  public get ResizeToWidth() {
    return this._resizeToWidth.toString();
  }
  public set ResizeToWidth(event: string) {
    this._resizeToWidth = Number.parseInt(event);
  }

  public get SrcImg() {
    // console.log("SrcImg()---" +this._img_name)
    if (this._flagPhoto) return this._img_cropped;
    if (this._rootSrc && this._img_name) return this._rootSrc +'S'+ this._img_name +'.webp';
    return this._rootSrc + 'not_found.webp';
  }

  public get ShowCroppedTab(): boolean {
    if (this._index_tabs == 0 || this._index_tabs == 2) return false;
    return true;
  }

  constructor(public _imgManager: ImgManagerService) {}

  

  public selectedIndexChangeMatTabGroup(event: number) {
    this._index_tabs = event;
    if (this._index_tabs == 0) {
      this._onFlagShowSaveDataBar.emit(true);
    } else {
      this._onFlagShowSaveDataBar.emit(false);
    }
    if (this._index_tabs == 0 && this._flagPhoto) {
      this.getDtoImgObgect();
    }
  }
  /** (html.#) or ViewChild.getDtoImgObgect() -- click in parent button for save server */
  public getDtoImgObgect() {
    //

    this._onChangedDtoImage.emit({
      base64Img: this._img_cropped,
      flagChanged: this._flagPhoto,
    });
  }

  public onSetFilePhoto(event: any): void {
    this._flagPhoto = true;
    //  this._select_obj= URL.createObjectURL(event.files[0])
    this._imageChanged = event;
    this._loading = true;
  }

  public togleShowUrl(){
    this._flagShowUrl=!this._flagShowUrl;
  }
  public onSetFileFromUrl(url:string) {
    //debugger
    this._flagError=false;
    if(url===null||undefined){
      this._flagError=true;
      this._messagess_show="Url для загрузки image не выбран"

      return
    }
   // debugger
    this._imgManager.ImgBase64FromUrl =url;
      // 'http://localhost:4200/assets/bg_img/bg-1.jpg';


  }

  cropperReady(sourceImageDimensions: Dimensions) {
    // console.log('Cropper ready', sourceImageDimensions);
    this._size_h = sourceImageDimensions.height;
    this._size_w = sourceImageDimensions.width;
    this._loading = false;
  }

  imageLoaded() {
    this._messagess_show = 'Файл успешно загружен..';
    this._i_canvasRotation = 0;
    this._flagError = false;
    this._flagPhoto = true;
    this._loading = false;
    // console.log("croped-img: loadImageFeled()-show ok");
  }

  loadImageFailed() {
    // console.error('Load image failed');
    this._messagess_show = 'Ошибка - файл не загружен,';
    this._flagError = true;
    this._flagPhoto = false;
    this._loading = false;
  }

  public imageCropped(event: ImageCroppedEvent) {
    // console.log('imageCropped--', event.base64)

    this._img_cropped = event.base64;
    this._cropped_size_h = event.height;
    this._cropped_size_w = event.width;
  }
  public zoomOut() {
    this._scale -= 0.1;
    this._transform = {
      ...this._transform,
      scale: this._scale,
    };
  }

  public zoomIn() {
    this._scale += 0.1;
    this._transform = {
      ...this._transform,
      scale: this._scale,
    };
  }
  public resetImage() {
    this._i_canvasRotation = 0;
    this._loading = false;
    this._scale = 1;
    this._rotation = 0;
    this._canvasRotation = 0;
    this._transform = {};
  }

  public toggleContainWithinAspectRatio() {
    this._containWithinAspectRatio = !this._containWithinAspectRatio;
  }
  public toggleMaintainAspectRatio() {
    this._maintainAspectRatio = !this._maintainAspectRatio;
  }

  public setCanvasRotation() {
    // debugger

    if (this._i_canvasRotation > 2) {
      this._i_canvasRotation = -1;
    }
    ++this._i_canvasRotation;
    switch (this._i_canvasRotation) {
      case 1:
        this._canvasRotation = 1;
        break;
      case 2:
        this._canvasRotation = 2;
        break;

      default:
        this._canvasRotation = 0;
        break;
    }
  }

  public setAspectRatio() {
    if (this._i_aspectRatio > 3) {
      this._i_aspectRatio = -1;
    }
    ++this._i_aspectRatio;

    switch (this._i_aspectRatio) {
      case 1:
        this._aspectRatio = 9 / 16;
        this._show_aspectRatio = '9/16';
        break;
      case 2:
        this._aspectRatio = 3 / 4;
        this._show_aspectRatio = '3/4';
        break;
      case 3:
        this._aspectRatio = 3 / 2;
        this._show_aspectRatio = '3/2';
        break;

      default:
        this._aspectRatio = 1 / 1;
        this._show_aspectRatio = '1 / 1';
        break;
    }
  }

  private flipAfterRotate() {
    const flippedH = this._transform.flipH;
    const flippedV = this._transform.flipV;
    this._transform = {
      ...this._transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this._transform = {
      ...this._transform,
      flipH: !this._transform.flipH,
    };
  }

  flipVertical() {
    this._transform = {
      ...this._transform,
      flipV: !this._transform.flipV,
    };
  }
}
