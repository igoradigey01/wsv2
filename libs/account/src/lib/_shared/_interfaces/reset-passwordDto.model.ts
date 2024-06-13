export interface ResetPasswordMailDto {
  password: string;
  confirmPassword: string;
  email: string;
  token: string;
}
