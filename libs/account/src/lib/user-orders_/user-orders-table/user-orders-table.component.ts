import { Component, ChangeDetectionStrategy } from '@angular/core';
import type { OnInit } from '@angular/core';

@Component({
    selector: 'x01-v1-user-orders-table',
    templateUrl: './user-orders-table.component.html',
    styleUrls: ['./user-orders-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserOrdersTableComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
