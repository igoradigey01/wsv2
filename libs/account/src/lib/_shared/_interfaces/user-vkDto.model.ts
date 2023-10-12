export interface UserVkDto {
    provider:string;
    idUser: string;
    idApp:string;
    first_name: string; 
    photo_rec_url?:string;
    last_name: string;      
    hash: string;
    spaId:string;
  }