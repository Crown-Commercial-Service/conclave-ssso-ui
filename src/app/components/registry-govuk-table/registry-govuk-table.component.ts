import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CiiAdditionalIdentifier, CiiOrgIdentifiersDto } from 'src/app/models/org';
import { TokenService } from 'src/app/services/auth/token.service';
import { ciiService } from 'src/app/services/cii/cii.service';
import { PaginationService } from 'src/app/shared/pagination.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registry-govuk-table',
  templateUrl: './registry-govuk-table.component.html',
  styleUrls: ['./registry-govuk-table.component.scss']
})
export class RegistryGovukTableComponent implements OnInit, OnChanges {
  @Input() headerText!: string[];
  @Input() data!: any[];
  @Input() pageName!: string;
  @Input() orgId!: string;
  @Output() hyperLinkClickEvent = new EventEmitter<any>();

  public pageCount?: number | any;
  public totalPagesArray: number[] = [];
  public tableVisibleData: any[] = [];
  public currentPage: number = 1;
  public pageSize: number = environment.listPageSize;
  public useClientPagination: boolean = true
  public useServerPagination: boolean = false
  public tableData: any;
  public pponSchema: string = 'GB-PPG';
  schemeData: any[] = [];
  ciiOrganisationId: string;
  public includeHiddenIdentifiers:boolean=false;

  public registries: CiiOrgIdentifiersDto;
  public additionalIdentifiers: CiiAdditionalIdentifier[];
  constructor(private PaginationService: PaginationService, private sharedDataService: SharedDataService, private readonly tokenService: TokenService, private ciiService: ciiService) {
    this.registries = {};
    this.additionalIdentifiers = [];
    this.ciiOrganisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  async ngOnInit() {

    
  }
  async ngOnChanges() {
    let ciiOrgId: any
    if (this.pageName === 'MO') {
      ciiOrgId = this.tokenService.getCiiOrgId();
    } else if (this.pageName === 'MSE' || 'MBSR') {
      ciiOrgId = this.orgId;
      this.includeHiddenIdentifiers=true
    }
    this.schemeData = await this.ciiService.getSchemes().toPromise() as any[];
    await this.ciiService.getOrgDetails(ciiOrgId,this.includeHiddenIdentifiers).toPromise().then((data: any) => {
      this.registries = data;
      data.identifier.primary = true
      this.additionalIdentifiers.push(data.identifier)
      data.additionalIdentifiers.forEach((Identifier: any) => {
        //PPON Schema Identifier should not be displayed in Manage Organisation(Bug-7218)
        if (this.pageName != 'MO' || Identifier.scheme != this.pponSchema) {
          Identifier.primary = false
          this.additionalIdentifiers.push(Identifier)
        }
      })
      this.mergeTabledata()
    }).catch(e => {
    });
  }

  private mergeTabledata() {
    this.pageCount = Math.ceil(this.additionalIdentifiers.length / this.pageSize);
    this.totalPagesArray = Array(this.pageCount).fill(0).map((x, i) => i + 1);
    this.tableVisibleData = this.additionalIdentifiers.slice(0, this.pageSize);
    this.currentPage = 1;
  }

  public getPaginationData(): Array<any> {
    return this.PaginationService.getVisibleDots(this.currentPage, this.pageCount)
  }


  public getSchemaName(schema: string): string {
    let selecedScheme = this.schemeData.find(s => s.scheme === schema);
    if (schema === 'GB-CCS' && this.pageName != 'MO') {
      return 'Internal Identifier';
    }
    return selecedScheme?.schemeName;
  }

  onSetPageClick(pageNumber: any) {
    if (pageNumber === '...') {
      return
    }
    this.currentPage = pageNumber;
    if (this.useClientPagination) {
      let startIndex = this.pageSize * (this.currentPage - 1);
      let endIndex = startIndex + this.pageSize;
      this.tableVisibleData = this.additionalIdentifiers.slice(startIndex, endIndex);
    }

  }


  onRowClick(dataRow: any) {
    console.log("dataRow", dataRow)
    this.hyperLinkClickEvent.emit(dataRow);
  }

  public generateRegistryRemoveRoute(row: any): any {
    return `/manage-org/profile/${this.ciiOrganisationId}/registry/delete/${row.scheme}/${row.id}`;
  }
}
