import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';


@Component({
  selector: 'wsv2-manager',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent {}
