import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component'
import { Input, Output, EventEmitter } from '@angular/core';
import { IButton } from '../_interfaces/button.model'

@Component({
  selector: 'wsv2-katalog',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './katalog.component.html',
  styleUrls: ['./katalog.component.scss'],
})
export class KatalogComponent {


  @Output() public onSelectButton = new EventEmitter<IButton>();


  @Input() public items: IButton[] | undefined;


  /**
  * Is this visible katalog
  */
  @Input() public componetVisible: boolean = true;
  
  @Input() public pathBackgroundImg:string |undefined;

  @Input() public showIdButton: boolean = true;

  @Input() public buttonBackground: boolean = true;



  public onSelectBt(obj: IButton) {
    this.onSelectButton.next(obj);
  }

}
