import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private maxVisibleDots:number = 7
  constructor() { }


 public getVisibleDots(currentPage:number ,pageCount:number ): Array<any> {
    const dots: Array<number | string> = [];
    const halfMaxDots = Math.floor(this.maxVisibleDots / 2);
    const start = Math.max(1, currentPage - halfMaxDots);
    const end = Math.min(start + this.maxVisibleDots - 1, pageCount);

    if (start > 1) {
      dots.push(1);
      if (start > 2) {
        dots.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      dots.push(i);
    }

    if (end < pageCount) {
      if (end < pageCount - 1) {
        dots.push('...');
      }
      dots.push(pageCount);
    }

    return dots;
  }
}
