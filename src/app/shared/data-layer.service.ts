import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class DataLayerService {
  private formId: string = "";
  private lastFormId: string = "";
  private valueChangesSubscription: Subscription;
  private uniqueId : string ="";
  private hashedId : string ="";

  constructor(private sessionService:SessionService) {
    this.valueChangesSubscription = new Subscription();
  }

  pushEvent(event: any) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(event);
  }

  pushClickEvent(buttonText: string) {
    this.pushEvent({
      event: "cta_button_click",
      link_text: buttonText,
      link_url: window.location.href
    });
  }

  pushPageViewEvent(extraProps: any = null) {
    const encryptedEmail = localStorage.getItem("user_name");
    const emailWithoutAtSymbol = encryptedEmail?.replace('@', '');
    if (emailWithoutAtSymbol)
    {
     this.hashedId = this.sessionService.generateUniqueKey(emailWithoutAtSymbol);
    }
    this.uniqueId =  this.hashedId;
    let eventInfo = {
      event: "page_view",
      page_location: window.location.href,
      user_id: localStorage.getItem("user_name"),
      user_org: localStorage.getItem("cii_organisation_id"),
      page_title: document.title
    };

    if (extraProps != null) {
      eventInfo = Object.assign(eventInfo, extraProps);
    }

    this.pushEvent(eventInfo);
    this.lastFormId = "";
  }

  pushFormStartOnInitEvent(formId: string) {
    this.pushEvent({
      event: 'form_start',
      form_id: formId
    });
  }

  pushFormStartEvent(formId: string, formGroup: FormGroup) {
    this.formId = formId;
    this.valueChangesSubscription = formGroup.valueChanges.subscribe(value => {
      if (this.lastFormId != this.formId) {
        this.lastFormId = this.formId;
        this.pushEvent({
          event: 'form_start',
          form_id: formId
        });
      }
    });
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

  ngOnDestroy() {
    this.valueChangesSubscription.unsubscribe();
  }

}
