import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { userTypeDetails } from 'src/app/models/user';

@Component({
  selector: 'app-govuk-radio',
  templateUrl: './govuk-radio.component.html',
  styleUrls: ['./govuk-radio.component.scss'],
})
export class GovukRadioComponent implements OnInit {
  @Input() details!: userTypeDetails;

  @Output() clickedData = new EventEmitter<any>();

  private selectedvalue:any=''

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.selectedvalue = this.details.selectedValue
  }

  public onClickRadio(dataRow: any) {
    dataRow.isFormChanged = !(this.selectedvalue === dataRow.name);
    this.clickedData.emit(dataRow);
  }
}
