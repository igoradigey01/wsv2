import { UI } from './ui.mondel'

export interface Article extends UI {
  id: number;
  name: string;
  hidden: boolean;
  postavchikId: number;
}
