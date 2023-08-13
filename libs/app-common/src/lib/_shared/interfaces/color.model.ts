import {UI} from './ui.mondel'

export interface Color extends UI{
  id: number;
  name: string;
  hidden:boolean;
  postavchikId:number;
}
