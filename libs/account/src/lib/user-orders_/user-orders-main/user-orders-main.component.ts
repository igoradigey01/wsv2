import { Component, OnInit } from '@angular/core';
import {StateView} from '../../_shared/_interfaces/state-view'

@Component({
  selector: 'x01-v1-user-orders-main',
  templateUrl: './user-orders-main.component.html',
  styleUrls: ['./user-orders-main.component.scss'],
})
export class UserOrdersMainComponent implements OnInit {

  public _flagViewState:StateView=StateView.default;
  constructor() {}

  ngOnInit(): void {}
}
