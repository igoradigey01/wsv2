import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {IButton} from '../../_shared/_interfaces/button.model'
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wsv2-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {

  /**
   * Optional click handler
   */ 
  @Output() public onButtonClick = new EventEmitter<IButton>();

  /**
   * Button contents id 
   * @required
   */
  @Input() public id:number | undefined=1;

   /**
   * Button contents   name
   * @required
   */
  @Input() public name:string | undefined;
     /**
   * Is this visible id label
   */
  @Input() public idVisible:boolean=true;

   
   
   
  public onBtClick(){
    let date=<IButton>{id:this.id,name:this.name}
    this.onButtonClick.next(date);
  }

  // public get btSizeCss(): string[] {   

  //   return  [`name-bt--${this.size}`];
  // }
}
