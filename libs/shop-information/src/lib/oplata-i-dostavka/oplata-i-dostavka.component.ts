import { Component, OnInit } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config'

@Component({
  selector: 'app-oplata-i-dostavka',
  templateUrl: './oplata-i-dostavka.component.html',
  styleUrls: ['./oplata-i-dostavka.component.scss']
})
export class OplataIDostavkaComponent implements OnInit {

  public product_delivery:boolean=false;

  constructor(
    private repository:CompanyInformationService
  ) { 
    this.product_delivery=repository.company_delivery;
  }

  ngOnInit(): void {
  }

}
