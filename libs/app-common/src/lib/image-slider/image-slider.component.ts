import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ISliderImage } from '../_shared/interfaces/slider-image.model';
import { CompanyInformationService } from "@wsv2/app-config";

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

  currentIndex: number = 0;
  timeoutId?: number;

  constructor(

  ) {
    //this.slideImgs=repository.company_photo;
  }

  ngOnInit(): void {
    //debugger
    // this.resetTimer();

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
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slideImgs.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    //this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    // this.resetTimer();
    this.currentIndex = slideIndex;
  }

  getCurrentSlideUrl() {
    return `url('${this.slideImgs[this.currentIndex].url}')`;
  }
}
