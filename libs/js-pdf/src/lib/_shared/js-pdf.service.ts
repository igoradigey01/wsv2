import { Injectable } from '@angular/core';
import { font_roboto_regular_normal } from './data/roboto-regular-normal-font';

import { jsPDF } from 'jspdf';

//declare var font:any;

@Injectable()
export class JsPDFService {
  private _loadFont = font_roboto_regular_normal; //Roboto-Regular-normal.js'

  constructor() // eslint-disable-next-line @typescript-eslint/no-empty-function
  {}

  public get DocPDF(): jsPDF {
    // debugger
    const doc = new jsPDF();

    const str = this._loadFont as string;

    doc.addFileToVFS('Roboto-Regular-normal.ttf', str);
    doc.addFont('Roboto-Regular-normal.ttf', 'Roboto', 'normal');
    // new jsPDF();                         //this._repository.DocPDF
    console.log(doc.getFontList());

    doc.setFont('Roboto');

    return doc;
  }
}
