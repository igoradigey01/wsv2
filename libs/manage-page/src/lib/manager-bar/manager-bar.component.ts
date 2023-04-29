import { Component, OnInit } from '@angular/core';
import {ManagerBarService} from '../shared/services/manager-bar.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager-bar.component.html',
  styleUrls: ['./manager-bar.component.scss']
})
export class ManagerBarComponent implements OnInit {

  public  _url_img=this.repository.RootImg;
  public _height_img:number=300;
  private _i=0;

  constructor( private repository:ManagerBarService) { }

  ngOnInit(): void {
  }
  public minimize_Height(){
    if(this._height_img>400)
    this._height_img=this._height_img-100;

  }
  public add_Height(){
    if(this._height_img<1500)
    this._height_img=this._height_img+100;

  }

}
