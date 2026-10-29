import { Component, ChangeDetectionStrategy } from '@angular/core';
import type { OnInit } from '@angular/core';

@Component({
    selector: 'x01-v1-user-orders-item',
    templateUrl: './user-orders-item.component.html',
    styleUrls: ['./user-orders-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserOrdersItemComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
