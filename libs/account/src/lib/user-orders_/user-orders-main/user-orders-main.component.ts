import { Component, ChangeDetectionStrategy } from '@angular/core';
import {StateView} from '../../_shared/_interfaces/state-view'

@Component({
    selector: 'wsv2-user-orders-main',
    templateUrl: './user-orders-main.component.html',
    styleUrls: ['./user-orders-main.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserOrdersMainComponent {

  public _flagViewState:StateView=StateView.default;
}
