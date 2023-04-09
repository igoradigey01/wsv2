import { ISliderImage} from '@wsv2/app-common'

export interface IGeoPoint{
    x:string;
    y:string;
}

export interface IWorkTime{
    start:string;
    end:string;
}

export interface ICompanyInformation {

    yandex_point:IGeoPoint; // x ,y 
    company_phone: string;
    company_normalize_phone: string;
    company_photo:ISliderImage[]; //photo_1.webp,photo_2.webp...
    company_name:string;
    company_copyright:string;
    company_time_create:string;
    company_activities:string;
    company_logo:string;// logo.webp
    company_work_time:IWorkTime;
    company_lunch_time:IWorkTime|undefined;
    company_guarantees:string;
}