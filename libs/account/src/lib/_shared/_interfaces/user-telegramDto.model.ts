export interface UserTelegramDto {
    id: number;
    firstName?: string;    
    userName?: string; 
    spaId?:string;  
    authDate: number;
    hash: string;
  }