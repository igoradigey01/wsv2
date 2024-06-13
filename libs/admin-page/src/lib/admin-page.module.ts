import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { adminPageRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(adminPageRoutes)],
})
export class AdminPageModule {}
