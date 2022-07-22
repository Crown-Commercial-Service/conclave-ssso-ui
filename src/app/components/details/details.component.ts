import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonAttributesService } from 'src/app/shared/common-attributes.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit,OnChanges {

  @Input() detailsData: any=''


  constructor(private attributes:CommonAttributesService) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("detailsData",this.detailsData)
  }

  ngOnInit(): void {
    this.attributes.DetailsAttributes()
  }
 
}
