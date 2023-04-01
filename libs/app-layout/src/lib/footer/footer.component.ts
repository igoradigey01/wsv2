import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'x01-v1-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  name = 'ЛДСП && МДФ Ханская';
  year:number=new Date(2022,8,14).getFullYear();
  title:string=" ИП Дячук ";

  constructor() {}

  ngOnInit(): void {}
}
