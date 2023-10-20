import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private selectedOption: string | null = null;
  constructor() { }
 
  public convertToLocalDateTime(eventDateTime:Date){
    const stringInput = eventDateTime +"+00:00" ;
    let timeZone = "Europe/London";
    const dateObject = new Date(stringInput).toLocaleString("en-GB", {timeZone,});
    const d=dateObject.replace(',','').split(' ');
    const [day, month, year] = d[0].split('/');
    const [hours, minutes, seconds] = d[1].split(':');
    const ukTimezone=new Date(year+'-'+month+'-'+day+'T'+d[1]);
    return ukTimezone;
  }
 

  getSelectedOption(): string | null {
    return this.selectedOption;
  }

  setSelectedOption(option: string | null) {
    this.selectedOption = option;
  }

}
