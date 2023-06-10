import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ISliderImage } from '@wsv2/app-common';


import { CommonModule } from '@angular/common';

@Component({
  selector: 'wsv2-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit, OnDestroy {

  @Input() slideImgs: ISliderImage[] = [];
  @Input() minHeight="200px";
  @Input() minWidth="200px"
  //@Input() height="450px"
  @Input()  marginTopSlideBar="85%"  // опустить от верха на 85%
  @Input()  marginLeftSlideBar="40%"  // отсптупить с лева на 40%(для шести точек 30%)


  currentIndex = 0;
  timeoutId?: number;

  img_bg=''

  public get  slideStyleObj(){
    return `background-image: url(${this.img_bg});min-height:${this.minHeight};min-width: ${this.minWidth};`
    //  ` height: ${this.height} ;`

  }

  public get dotsContainerStyleObj(){
    return `margin-left: ${this.marginLeftSlideBar}; margin-top: ${this.marginTopSlideBar};`
  }

  constructor(

  ) {
    //this.slideImgs=repository.company_photo;
  }

  ngOnInit(): void {
   this.getCurrentSlideUrl();

  }
  ngOnDestroy() {
    window.clearTimeout(this.timeoutId);
  }
  // resetTimer() {
  //   if (this.timeoutId) {
  //     window.clearTimeout(this.timeoutId);
  //   }
  //   this.timeoutId = window.setTimeout(() => this.goToNext(), 3000);
  // }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.slideImgs.length - 1
      : this.currentIndex - 1;

    //  this.resetTimer();
    this.currentIndex = newIndex;
    this.getCurrentSlideUrl();
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slideImgs.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    //this.resetTimer();
    this.currentIndex = newIndex;
    this.getCurrentSlideUrl();
  }

  goToSlide(slideIndex: number): void {
    // this.resetTimer();
    this.currentIndex = slideIndex;
    this.getCurrentSlideUrl()
  }

  getCurrentSlideUrl() {
   //debugger
    this.img_bg=this.slideImgs[this.currentIndex].url;
  }
}
