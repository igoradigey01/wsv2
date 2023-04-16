import { Component, OnInit } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config';
@Component({
  selector: 'app-kak-zakazat',
  templateUrl: './kak-zakazat.component.html',
  styleUrls: ['./kak-zakazat.component.scss']
})
export class KakZakazatComponent implements OnInit {

  public phone:string=''

  constructor( 
    private repository:CompanyInformationService
  ) {
     this.phone=repository.company_phone;

   }

  ngOnInit(): void {
  }

}
