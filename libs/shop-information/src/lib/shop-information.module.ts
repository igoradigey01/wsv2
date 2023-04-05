import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { shopInformationRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(shopInformationRoutes)],
})
export class ShopInformationModule {}
