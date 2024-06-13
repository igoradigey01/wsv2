import { Component, OnInit } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config'

@Component({
  selector: 'app-garantiya',
  templateUrl: './garantiya.component.html',
  styleUrls: ['./garantiya.component.scss']
})
export class GarantiyaComponent implements OnInit {

  public guarantees:string=''
  public whatsapp_href:string=`https://wa.me/${this.repository.company_normalize_phone}?text=Здравствуйте%20[${this.repository.company_name}]%20У%20Меня%20Возникла%20Проблема%20C%20`
  constructor(
    private repository:CompanyInformationService
  ) { 
    this.guarantees=repository.company_guarantees;
  }

  ngOnInit(): void {
  }
  
}
