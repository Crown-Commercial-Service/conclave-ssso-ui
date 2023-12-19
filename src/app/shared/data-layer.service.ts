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

  pushPageViewEvent(extraProps: any = null) {
    let eventInfo = { 
      event: "page_view" ,
      page_location: window.location.href,
      user_id: localStorage.getItem("user_name"),
      user_org: localStorage.getItem("cii_organisation_id"),
      page_title: document.title
    };
    
    if(extraProps != null){
      eventInfo = Object.assign(eventInfo, extraProps);
    }

    this.pushEvent(eventInfo);
  }

  pushFormStartEvent(formId: string) {
    // this.pushEvent({
    //   event: 'form_start',
    //   form_id: formId
    // });
  }

  pushFormSubmitEvent(formId: string) {
    this.pushEvent({
      event: 'form_submit',
      form_id: formId
    });
  }

  pushFormErrorEvent(formId: string) {
    this.pushEvent({
      event: 'form_error',
      form_id: formId
    });
  }
  
}
