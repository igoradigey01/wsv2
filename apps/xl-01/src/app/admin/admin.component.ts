import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '../material.module'

@Component({
  selector: 'wsv2-admin',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {}
