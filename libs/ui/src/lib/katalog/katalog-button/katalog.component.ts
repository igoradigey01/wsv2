import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';

import { Input, Output, EventEmitter } from '@angular/core';
import { IButton } from '../../_shared/_interfaces/button.model';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';

@Component({
  selector: 'wsv2-katalog-button',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './katalog.component.html',
  styleUrls: ['./katalog.component.scss'],
})
export class KatalogComponent implements OnInit, OnDestroy {
  @Output() public onSelectButton = new EventEmitter<IButton>();

  @Input() public items: IButton[] | undefined;

  /**
   * Is this visible katalog
   */
  @Input() public componetVisible: boolean = true;

  /**
   * Is this [] url img for Background katalog
   */
  @Input() public urlBackgroundImgs: string[] | undefined;

  @Input() public flagButtonId: boolean = true;

  @Input() public flagButtonOpacity: boolean = true;

  @Input() public flagBackgroundImg: boolean = true;

  @Input() public timer: number = 10000;

  private i = 0;
  private timerId: any;

  subscription_timer: Subscription | undefined;

  public get slideStyleObj(): string {

    if(this.flagBackgroundImg){
    // debugger
    if (this.urlBackgroundImgs && this.urlBackgroundImgs.length > 0) {
      let j = 0;
      //----------------------if----------------
      if (this.i == this.urlBackgroundImgs.length - 1) {
        j = this.i;
        let obj1 = 'background-image: url(' + this.urlBackgroundImgs[j] + ');';
        this.i = 0;
        return obj1;
      }
      //------------else-----------
      j = this.i;
      let obj2 = 'background-image: url(' + this.urlBackgroundImgs[j] + ');';
      this.i++;
      return obj2;
    } else {
      //------------------------ elese  ----
      return 'background-image: none;';
    }
  }
   
  return 'background-image: none;';
  }

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.urlBackgroundImgs && this.urlBackgroundImgs.length > 1) {
      const source = interval(this.timer);
      //output: 0,1,2,3,4,5....
      this.subscription_timer = source.subscribe((val) => {
        console.log("--i time-interval --"+this.i);
        this.slideStyleObj;
        this.cd.detectChanges(); // проверить измениения в компоненте
      });
      return;
    }
     
    this.slideStyleObj;
    console.log("--i not-tim-interval --"+this.i);
  }

  ngOnDestroy() {
    if (this.subscription_timer) this.subscription_timer.unsubscribe();
  }

  public onSelectBt(obj: IButton) {
    this.onSelectButton.next(obj);
  }

  public onBackgroundImg(){
    this.flagBackgroundImg=!this.flagBackgroundImg;
  }
}
