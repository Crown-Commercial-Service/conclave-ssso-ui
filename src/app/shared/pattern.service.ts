import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatternService {
  constructor() {}

  emailPattern =
    /^(("[\w-\s]+")|([\w-!#$%&'*+-/=?^_`{|}~^.-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;

  phoneNumber = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  onlyIntegers = /^[0-9]*$/;

  yearPattern = /^([0-9]{4})*$/;

  DatePattern = /^([0-9]{1})*$/;

  decimalAllowed = /^[0-9]\d*(\.\d+)?$/;

  public EmailValidation(data: any) {
    let returnData = false;
    if (data.length && data.split('@')) {
      const localPart = data.split('@');
      if (localPart[0].length >= 64) {
        returnData = true;
      } else {
        returnData = true;
      }
    }
    return returnData;
  }
}
