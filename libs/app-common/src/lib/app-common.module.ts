import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { appCommonRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(appCommonRoutes)],
})
export class AppCommonModule {}
