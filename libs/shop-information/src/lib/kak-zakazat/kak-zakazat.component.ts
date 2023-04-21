import { Component, OnInit } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config';
import {IPhone} from "@wsv2/app-common";
@Component({
  selector: 'app-kak-zakazat',
  templateUrl: './kak-zakazat.component.html',
  styleUrls: ['./kak-zakazat.component.scss']
})
export class KakZakazatComponent implements OnInit {

  public phones:IPhone[];

  constructor( 
    private repository:CompanyInformationService
  ) {
     this.phones=repository.company_phones;

   }

  ngOnInit(): void {
  }

}
