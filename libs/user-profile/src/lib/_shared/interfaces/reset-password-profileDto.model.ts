export interface ResetPasswordProfileDto {
    oldPassword: string;
    newPassword:string;
    confirmPassword: string;
    email?: string;
    phone?:string;
    
  }
  