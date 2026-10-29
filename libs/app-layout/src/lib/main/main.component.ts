import { Component, ChangeDetectionStrategy } from '@angular/core';
import type { OnInit } from '@angular/core';


@Component({
    selector: 'x01-v1-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
//header footer main 
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //test user manager---
  

}
