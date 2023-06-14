import { Component , ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeModule } from 'ng-qrcode';

import { MatButtonModule } from '@angular/material/button';
import { jsPDF } from "jspdf";
import {JsPDFService} from '@wsv2/js-pdf'



@Component({
  selector: 'wsv2-qr-code',
  templateUrl: './qr-code.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    QrCodeModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./qr-code.component.scss'],
  providers:[JsPDFService]
})
export class QrCodeComponent  {



  @Input() public productURL=''
  @Input() public katalogURL=''
  @Input() public flagShowQrKatlog=true;
  @Input() public productName=''
  @Input() public katalogName='';
  public error:string|undefined;
  public hostURL ='';



   public get NomenclatureURL():string{
    
      return `${this.hostURL}${this.productURL}`
     
   }


   public get KatalogURL():string{
      
       return `${this.hostURL}${this.katalogURL}`
       
   }

  constructor(
    private _repository:JsPDFService
  ) {
    
  }

  

 


   public printQrKtalog():void{
     this.error=undefined;
    const toPrint = document.getElementsByTagName('canvas')[0];
    if(toPrint){
    const imageData=this.getBase64Canvas(toPrint);
    //console.log(imageData);
    const doc = this._repository.DocPDF
   // console.log(doc.getFontList)
    doc.setProperties({
      title:   this.productName

  });

    this.createDoc(doc,imageData);

    doc.autoPrint();
    doc.output("dataurlnewwindow");
   // doc.save('tatle');
    }
    else{
      this.error="QR code незадан!"

    }

   }

  public downloadQrKtalog() {
    this.error=undefined;
    const toPrint = document.getElementsByTagName('canvas')[0];
    if(toPrint){
    const imageData=this.getBase64Canvas(toPrint);
    //console.log(imageData);
    const doc = this._repository.DocPDF
   // console.log(doc.getFontList)
    doc.setProperties({
      title:   this.productName

  });

    this.createDoc(doc,imageData);


    doc.save(this.productName);
    }
    else{
      this.error="QR code незадан!"

    }
  }

  public printQrNomenclature():void{
    this.error=undefined;
   const toPrint = document.getElementsByTagName('canvas')[1];
   if(toPrint){
   const imageData=this.getBase64Canvas(toPrint);
   //console.log(imageData);
   const doc = this._repository.DocPDF
  // console.log(doc.getFontList)
   doc.setProperties({
     title:   this.productName

 });

   this.createDoc(doc,imageData);

   doc.autoPrint();
   doc.output("dataurlnewwindow");
  // doc.save('tatle');
   }
   else{
     this.error="QR code незадан!"

   }

  }

 public downloadQrNomenclature() {
   this.error=undefined;
   const toPrint = document.getElementsByTagName('canvas')[1];
   if(toPrint){
  const imageData=this.getBase64Canvas(toPrint);
   //console.log(imageData);
   const doc = this._repository.DocPDF
  // console.log(doc.getFontList)
   doc.setProperties({
     title:   this.productName

 });

   this.createDoc(doc,imageData);


   doc.save(this.productName);
   }
   else{
     this.error="QR code незадан!"

   }
 }

  private createDoc(doc:jsPDF,base64:string){



   console.log(   doc.getFontList());

    doc.text(this.productName,40,5);
   const y_img=10;
    const y=40;
    const x=40;

    doc.addImage(base64, 'JPEG', 0, y_img, x, y);
    doc.addImage(base64, 'JPEG', 40, y_img, x, y);
    doc.addImage(base64, 'JPEG', 80, y_img, x, y);
    doc.addImage(base64, 'JPEG', 120, y_img, x, y);
    doc.addImage(base64, 'JPEG', 160, y_img, x, y);
   // doc.addImage(base64, 'JPEG', 180, y_img, x, y);
    // doc.addImage(base64, 'JPEG', 120, y_img, 20, 20);
    // doc.addImage(base64, 'JPEG', 140, y_img, 20, 20);
    // doc.addImage(base64, 'JPEG', 160, y_img, 20, 20);
    // doc.addImage(base64, 'JPEG', 180, y_img, 20, 20);

  }

  private  getBase64Canvas(canvas:any):string{
    const dataURL =<string> canvas.toDataURL("image/png");
    return dataURL;

  }



}
