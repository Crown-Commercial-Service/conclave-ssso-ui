import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationEnum } from 'src/app/constants/enum';
import { OrganisationSiteResponse } from 'src/app/models/site';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-manage-organisation-profile-add-contact-to-site',
  templateUrl: './manage-organisation-profile-add-contact-to-site.component.html',
  styleUrls: ['./manage-organisation-profile-add-contact-to-site.component.scss']
})
export class ManageOrganisationProfileAddContactToSiteComponent implements OnInit {

 public contactSelectedOption='addnewcontact'
 public siteInfo:any={}
 public siteId: any;
 public organisationId: string;
 public isEdit:boolean =false;
  constructor(private router: Router,private activatedRoute: ActivatedRoute,private orgSiteService: WrapperOrganisationSiteService, private dataLayerService: DataLayerService) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.data) {
      let routeData = JSON.parse(queryParams.data);
      this.siteId=routeData.siteId
      this.isEdit=routeData.isEdit
    }
   }

  ngOnInit(): void {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: localStorage.getItem("user_name"),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
    this.getSiteDetails()
  }

 public getSiteDetails():void{
  this.orgSiteService.getOrganisationSite(this.organisationId, this.siteId).subscribe(
    {
      next: (siteInfo: OrganisationSiteResponse) => {
      this.siteInfo=siteInfo
      },
      error: (error: any) => {
        console.log(error);
      }
    });
 }
 


 public onSiteEditClick() {
  let data = {
      'isEdit': true,
      'siteId': this.siteId
  };
  this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
}


/**
 * continue button method function.radio input based function call
 * @param SelectedOption radio input value from html
 */
  public Continue(SelectedOption:string):void{
    let data ={siteId:this.siteId,siteCreate:true}
    switch (SelectedOption){
      case "addnewcontact":{
          this.onContactAddClick()
          break
      }
      case "findandassigncontact":{
          this.onContactAssignClick()
          break
      }
      case "skip":{
          this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.CreateSite}?data=` + JSON.stringify(data));
          break
      }
  }
  }
  
/**
 * Contact add method
 */
  public onContactAddClick():void {
    let data = {
      'isEdit': false,
      'contactId': 0,
      'siteId': this.siteId,
      'siteCreate':true,
      'contactAddAnother': false
    };
    this.router.navigateByUrl('manage-org/profile/site/contact-edit?data=' + JSON.stringify(data));
  }


  /**
   * Contact assign method
   */
  public onContactAssignClick():void {
    let data = {
      'assigningSiteId': this.siteId,
      'siteCreate':true
    };
    this.router.navigateByUrl('contact-assign/select?data=' + JSON.stringify(data));
  }


}
