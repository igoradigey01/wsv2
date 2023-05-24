import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { shopOrdersRoutes } from './lib.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(shopOrdersRoutes),
    RouterModule.forChild(shopOrdersRoutes),
  ],
})
export class ShopOrdersModule {}
