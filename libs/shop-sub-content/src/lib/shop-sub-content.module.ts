import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { shopSubContentRoutes } from './lib.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(shopSubContentRoutes),
    RouterModule.forChild(shopSubContentRoutes),
  ],
})
export class ShopSubContentModule {}
