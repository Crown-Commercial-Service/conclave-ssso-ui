import { Injectable } from '@angular/core';
import { DataLayerService } from './data-layer.service';

@Injectable({
  providedIn: 'root'
})
export class CommonAttributesService {

  constructor(private dataLayerService: DataLayerService) { }

  private handleToggle = (event: Event) => {
    const targetDetail = event.target as HTMLDetailsElement;
    const details = document.querySelectorAll("details");
    const parentElement = targetDetail.parentElement?.parentElement;
    var headertext = '';
    if (parentElement)
    {
       const firstChildText = parentElement.firstChild?.textContent;
       if (firstChildText)
       {  
        headertext = `${firstChildText} - ${'Help content'}`
       }  
    }
    
    if (targetDetail.open) {
      this.dataLayerService.pushEvent({
        event: "accordion_use",
        interaction_type: "open",
        link_text: headertext
      })
  
      details.forEach((detail) => {
        if (detail !== targetDetail && detail.open) {
          detail.removeAttribute("open");
        }
      });
    } else {
      this.dataLayerService.pushEvent({
        event: "accordion_use",
        interaction_type: "close",
        link_text: headertext
      })
    }
  };

 
  DetailsAttributes() {
    const details = document.querySelectorAll("details");
    details.forEach((targetDetail) => {
      targetDetail.removeEventListener("toggle", this.handleToggle);
      targetDetail.addEventListener("toggle", this.handleToggle);
    });
  }

}
