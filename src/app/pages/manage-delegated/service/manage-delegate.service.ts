import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManageDelegateService {

  constructor() { }


  public ValueChanged(data: string, box: string, form: string): void {
    if (form === 'startdate') {
      if (box == 'start-day' && data.length > 1) {
        document.getElementById('start-month')?.focus();
      } else if (box == 'start-month' && data.length > 1) {
        document.getElementById('start-year')?.focus();
      }
    } else if (form === 'enddate') {
      if (box == 'end-day' && data.length > 1) {
        document.getElementById('end-month')?.focus();
      } else if (box == 'end-month' && data.length > 1) {
        document.getElementById('end-year')?.focus();
      }
    }
  }

  public tiggerBackspace(data: any, box: string, form: string): void {
    if (form === 'startdate') {
      if (box == 'start-year' && data.length == 0) {
        document.getElementById('start-month')?.focus();
      } else if (box == 'start-month' && data.length == 0) {
        document.getElementById('start-day')?.focus();
      }
    } else if (form === 'enddate') {
      if (box == 'end-year' && data.length == 0) {
        document.getElementById('end-month')?.focus();
      } else if (box == 'end-month' && data.length == 0) {
        document.getElementById('end-day')?.focus();
      }
    }
  }

  public SetInputFocus(inputIndex: string):void{
    document.getElementById(inputIndex)?.focus();

  }
}
