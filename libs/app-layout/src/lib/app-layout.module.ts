import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from './material.module';

import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
//import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,    
    RouterModule, // елси не задать неработает routerLink=''
  ],
  declarations: [
    FooterComponent,
    SidebarComponent,
   // HeaderComponent,
    MainComponent,   
  ],
  exports: [
    FooterComponent,
    SidebarComponent,
   // HeaderComponent,
    MainComponent,   
  ],
})
export class AppLayoutModule {}
