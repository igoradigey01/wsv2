import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';

import { Input, Output, EventEmitter } from '@angular/core';
import { IButton } from '@wsv2/app-common';
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
  @Output() public _onSelectButton = new EventEmitter<IButton>();

 private _items =<IButton[]>[] ;

  @Input()
  set items(value: IButton[]) {
   this._items = value;
    this.katalogItems.set(this._items);

    //console.log(value);
  }
  public katalogItems = signal(this._items);

  /**
   * Is this visible katalog
   */
  @Input() public componetVisible = true;

  /**
   * Is this [] url img for Background katalog
   */
  @Input() public urlBackgroundImgs: string[] | undefined;

  @Input() public flagButtonId = true;

  @Input() public flagButtonOpacity = true;

  @Input() public flagBackgroundImg = true;

  @Input() public timer = 10000;

  private i = 0;
 // private timerId: any;  4.11.23

  subscription_timer: Subscription | undefined;

  public get slideStyleObj(): string {

    if (this.flagBackgroundImg) {
      // debugger
      if (this.urlBackgroundImgs && this.urlBackgroundImgs.length > 0) {
        let j = 0;
        //----------------------if----------------
        if (this.i == this.urlBackgroundImgs.length - 1) {
          j = this.i;
          const obj1 = 'background-image: url(' + this.urlBackgroundImgs[j] + ');';
          this.i = 0;
          return obj1;
        }
        //------------else-----------
        j = this.i;
        const obj2 = 'background-image: url(' + this.urlBackgroundImgs[j] + ');';
        this.i++;
        return obj2;
      } else {
        //------------------------ elese  ----
        return 'background-image: none;';
      }
    }

    return 'background-image: none;';
  }

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.urlBackgroundImgs && this.urlBackgroundImgs.length > 1) {
      const source = interval(this.timer);
      //output: 0,1,2,3,4,5....
      this.subscription_timer = source.subscribe(() => {
        //console.log("--i time-interval --" + this.i);
        this.slideStyleObj;
        this.cd.detectChanges(); // проверить измениения в компоненте
      });
      return;
    }

    this.slideStyleObj;
    //console.log("--i not-tim-interval --" + this.i);
  }

  ngOnDestroy() {
    if (this.subscription_timer) this.subscription_timer.unsubscribe();
  }

  public onSelectBt(obj: IButton) {
    //debugger
    this._onSelectButton.emit(obj);
  }

  public onBackgroundImg() {
    this.flagBackgroundImg = !this.flagBackgroundImg;
  }
}
