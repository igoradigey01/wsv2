import { Component,ChangeDetectionStrategy } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {IButton} from '../_interfaces/button.model'
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wsv2-card-product',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
})
export class CardProductComponent {

  @Output() public onButtonClick = new EventEmitter<IButton>();

  @Input() public id:number | undefined=1;

   
  @Input() public title:string | undefined;

  @Input() public content:string | undefined;

  @Input() public price:string | undefined;

  @Input() public cardImage:string|undefined;
  @Input() public notFoundImage:string="assets/not_found600.webp";


  public get katalogBackgroundStile(): string {
    if(this.cardImage)
    return this.cardImage;
    return this.notFoundImage;
  }




}
