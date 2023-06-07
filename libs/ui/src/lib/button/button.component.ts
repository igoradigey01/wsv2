import { Component,ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {IButton} from '../_shared/_interfaces/button.model'
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wsv2-button',
  standalone: true,  
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {

 
  @Output() public _onButtonClick = new EventEmitter<IButton>();

  
  @Input() public id:number | undefined=1;

   
  @Input() public name:string | undefined;
     /**
   * Is this visible id label
   */
  @Input() public flagButtonId=true;
  
  
  @Input() public  flagButtonOpacity=true;
   
   
   
  public onBtClick(){
    const date=<IButton>{id:this.id,name:this.name}
    this._onButtonClick.next(date);
  }

}
