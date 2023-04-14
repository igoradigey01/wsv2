import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ISliderImage } from '../_shared/interfaces/slider-image.model';


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
  @Input() minHeightPhoto:string="300";
  @Input() minWidthPhoto:string="300"
  @Input()  marginTopSlideBar:string="85"  // опустить от верха на 85%
  @Input()  marginLeftSlideBar:string="40"  // отсптупить с лева на 40%(для шести точек 30%)


  currentIndex: number = 0;
  timeoutId?: number;

  img_bg:string=''

  public get  slideStyleObj(){
    return `background-image: url(${this.img_bg});min-height:${this.minHeightPhoto}px;min-width: ${this.minWidthPhoto}px;`

  }

  public get dotsContainerStyleObj(){
    return `margin-left: ${this.marginLeftSlideBar}%; margin-top: ${this.marginTopSlideBar}%;`
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
    this.img_bg=this.slideImgs[this.currentIndex].url;
  }
}
