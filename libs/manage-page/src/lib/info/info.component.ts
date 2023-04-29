import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})

export class InfoComponent implements OnInit {

   versionServer:string|undefined;
   versionClint:string|undefined;

  constructor(

  ) { }

  ngOnInit(): void {

  }

}
