import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonAttributesService {

  constructor() { }

 
DetailsAttributes(){
const details = document.querySelectorAll("details");
details.forEach((targetDetail) => {
  targetDetail.addEventListener("click", () => {
    details.forEach((detail) => {
      if (detail !== targetDetail) {
        detail.removeAttribute("open");
      }
    });
  });
});
}

}
