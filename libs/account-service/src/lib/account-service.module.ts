import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { accountServiceRoutes } from './lib.routes';


@NgModule({
  imports: [CommonModule, RouterModule.forChild(accountServiceRoutes)],

})
export class AccountServiceModule {}
