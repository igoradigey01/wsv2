import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { shopContentRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(shopContentRoutes)],
})
export class ShopContentModule {}
