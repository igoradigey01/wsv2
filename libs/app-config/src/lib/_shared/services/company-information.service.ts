import { Injectable } from '@angular/core';
import {ICompanyInformation,IGeoPoint,IWorkTime} from '../interfaces/company-information.model'

@Injectable({
  providedIn: 'root',
})
export class CompanyInformationService implements ICompanyInformation {
    yandex_point:IGeoPoint={x:'',y:''}// x ,y 
    company_phone: string='';
    company_normalize_phone: string ='';
    company_photo:string[]=[]; //photo_1.webp,photo_2.webp...
    company_name:string='';
    company_copyright:string='ИП';
    company_time_create:string="2023";
    company_activities:string="Розничная торговля мебелью.  Ханская"; //виды деятельности компании
    company_logo:string ='logo.webp';// logo.webp
    company_work_time:IWorkTime={start:'9-00',end:'17-00'};
    company_lunch_time:IWorkTime|undefined;
    company_guarantees:string='без предоставления каких-либо гарантий';
}