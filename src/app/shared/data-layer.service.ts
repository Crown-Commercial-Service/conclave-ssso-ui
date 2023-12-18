import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataLayerService {

  constructor() { }

  pushEvent(event: any) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(event);
  }

  pushClickEvent(buttonText: string) {
    this.pushEvent({ 
      event: "cta_button_click" ,
      link_text: buttonText,
      link_url: window.location.href
    });
  }
}
