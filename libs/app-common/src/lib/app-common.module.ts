import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { appCommonRoutes } from './lib.routes';
//import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
//import { ImageSliderComponent } from './image-slider/image-slider.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule, // елси не задать неработает routerLink=''
    // RouterModule.forChild(appCommonRoutes)
    ],
  declarations: [],
  exports: [],
})
export class App01CommonModule {}
