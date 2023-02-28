import { HttpParameterCodec } from "@angular/common/http";

/** to help us encode our token (which contains some special characters)--HttpParameterCodec */
export class UrlEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
      return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
      return encodeURIComponent(value);
    }

    decodeKey(key: string): string {
      return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
      return decodeURIComponent(value);
    }
  }
