import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { indexLayoutRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(indexLayoutRoutes)],
})
export class IndexLayoutModule {}
