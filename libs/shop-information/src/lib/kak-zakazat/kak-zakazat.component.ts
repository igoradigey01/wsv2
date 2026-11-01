import { Component, ChangeDetectionStrategy } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config';
import {IPhone} from "@wsv2/app-config";
@Component({
    selector: 'wsv2-kak-zakazat',
    templateUrl: './kak-zakazat.component.html',
    styleUrls: ['./kak-zakazat.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class KakZakazatComponent {

  public phones:IPhone[];

  constructor( 
    private repository:CompanyInformationService
  ) {
     this.phones=repository.company_phones;

   }

 

}
