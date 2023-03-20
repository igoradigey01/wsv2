import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { appCommonRoutes } from './lib.routes';
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

@NgModule({
  imports: [CommonModule, RouterModule.forChild(appCommonRoutes)],
  declarations:[PageNotFoundComponent],
  exports: [PageNotFoundComponent]
 
})
export class App01CommonModule {}
