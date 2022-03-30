import { Component, Input, OnInit } from '@angular/core';
import { CommonAttributesService } from 'src/app/shared/common-attributes.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input() detailsData: any=''


  constructor(private attributes:CommonAttributesService) { }

  ngOnInit(): void {
    this.attributes.DetailsAttributes()
  }

}
