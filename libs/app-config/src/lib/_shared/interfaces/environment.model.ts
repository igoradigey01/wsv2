/**
 * любой envionment в app должен соответсвовать 
 * этому интерфейсу.Это соглашение для этого monorepo : WSV2
 */

export interface IEnvironment {

 
  clientUri: string; //  Host client
  serverUri: string; // Host api               //
  serverAuthUri: string; // Host identity server          //
  clientId: string; //xf-01.ru='1'
  postavchikIds: string[]; //xf-01,xl-01,shagen01
  vkId:string;
  version: string; // 'b2.05.22',
  description: string; //"Client shop- вторая редакция (angular:13.1.2)(11.05.22)"

}
