import {Nomenclature} from '../../../../../app-common/src/lib/_shared/interfaces/nomenclature.model'

export interface CartItem {
    product: Nomenclature;
    quantity: number;
  }