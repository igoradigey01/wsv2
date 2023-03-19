import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { managerLayoutRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(managerLayoutRoutes)],
})
export class ManagerLayoutModule {}
