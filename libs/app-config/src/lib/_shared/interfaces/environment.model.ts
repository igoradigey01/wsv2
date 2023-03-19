/**
 * любой envionment в app должен соответсвовать 
 * этому интерфейсу.Это соглашение для этого monorepo : WSV2
 */

export interface IEnvironment {

  production: boolean;
  clientRoot: string; //  Host client
  serverRoot: string; // Host api               //
  serverAuthority: string; // Host identity server          //
  clientId: string; // sample for identity server   'angular-client',
  postavchikId: string; //xf-01.ru='1'

  version: string; // 'b2.05.22',
  description: string; //"Client shop- вторая редакция (angular:13.1.2)(11.05.22)"

}
