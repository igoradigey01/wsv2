import { Component, ChangeDetectionStrategy } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config'

@Component({
    selector: 'wsv2-garantiya',
    templateUrl: './garantiya.component.html',
    styleUrls: ['./garantiya.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GarantiyaComponent {

  public guarantees=''
  public whatsapp_href=`https://wa.me/${this.repository.company_normalize_phone}?text=Здравствуйте%20[${this.repository.company_name}]%20У%20Меня%20Возникла%20Проблема%20C%20`
  constructor(
    private repository:CompanyInformationService
  ) { 
    this.guarantees=repository.company_guarantees;
  }

}
