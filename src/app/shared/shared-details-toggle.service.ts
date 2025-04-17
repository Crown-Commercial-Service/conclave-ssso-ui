import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailsToggleService {

  private toggleHandlers = new Map<Element, EventListener>();

  constructor() { }

  addToggleListener(detailsElement: Element, callback: (isOpen: boolean) => void) {
    if (!this.toggleHandlers.has(detailsElement)) {
      const handler = (event: Event) => {
        const targetDetail = event.target as HTMLDetailsElement;
        const isOpen = targetDetail.open;

        if (callback) {
          callback(isOpen);
        }
      };

      detailsElement.addEventListener('toggle', handler);
      this.toggleHandlers.set(detailsElement, handler);
    }
  }

  removeToggleListener(detailsElement: Element) {
    if (this.toggleHandlers.has(detailsElement)) {
      const handler = this.toggleHandlers.get(detailsElement);
      if (handler) {
        detailsElement.removeEventListener('toggle', handler);
        this.toggleHandlers.delete(detailsElement);
      }
    }
  }
}