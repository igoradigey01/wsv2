import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { accountRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(accountRoutes)],
})
export class AccountModule {}
