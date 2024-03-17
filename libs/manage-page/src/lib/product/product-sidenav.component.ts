import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';


@Component({
  selector: 'wsv2-product-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule
  ],
  templateUrl: './product-sidenav.component.html',
  styleUrls: ['./product-sidenav.component.scss'],
})
export class ProductSidenavComponent {}
