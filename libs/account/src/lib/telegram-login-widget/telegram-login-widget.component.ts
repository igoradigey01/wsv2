import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TelegramLoginWidgetService} from '../_shared/services/telegram-login-widget.servise'

//https://github.com/angular/components/tree/main/src/google-maps#readme

@Component({
  selector: 'x01-v1-telegram-login-widget',
  templateUrl: './telegram-login-widget.component.html',
  styleUrls: ['./telegram-login-widget.component.scss'],
})
export class TelegramLoginWidgetComponent implements OnInit {
  

  private script:string=''

  constructor(
    private repozitory:TelegramLoginWidgetService
  ) {
    
  }

  ngOnInit(): void {

    this.repozitory.loadWidgetScript();
  }

  

}
