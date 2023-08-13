import {UI} from './ui.mondel'

export interface Brand extends UI{
  id: number;
  name: string;
  hidden:boolean;
  postavchikId:number;
}
