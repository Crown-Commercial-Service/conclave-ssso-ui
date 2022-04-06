import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PatternService {
  constructor() {}

  // emailPattern = /^(("[\w-\s]+")|([\w-!#$%&'*+-/=?^_`{|}~^.-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;

  emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  phoneNumber = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  onlyIntegers = /^[0-9]*$/;

  yearPattern = /^([0-9]{4})*$/;

  DatePattern = /^([0-9]{1})*$/;

  decimalAllowed = /^[0-9]\d*(\.\d+)?$/;

 /**
   * Email validator for all pages
   * @param data Email
   * @returns Validated boolean value
   */
  public emailValidator(data: any) {
    //total part
    if (data.length >= 257) {
      return true;
    }
    //first part
    if (data.split('@')[0].length >= 65) {
      return true;
    }
    //secound part
    if (data.split('@')[1].split('.')[0].length >= 64) {
      return true;
    }
    //third part
    if (data.split('@')[1].split('.')[1].length >= 64) {
      return true;
      // default part
    } else {
      return false;
    }
  }
}
