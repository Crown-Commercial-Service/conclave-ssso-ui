import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManualValidationStatus } from 'src/app/constants/enum';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';

@Component({
  selector: 'app-remove-right-to-buy',
  templateUrl: './remove-right-to-buy.component.html',
  styleUrls: ['./remove-right-to-buy.component.scss']
})
export class RemoveRightToBuyComponent implements OnInit {

  constructor(private router:Router,private route: ActivatedRoute,private wrapperBuyerAndBothService:WrapperBuyerBothService) { }
  public routeDetails:any = {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
    })
    
  }

 public Back():void {
    window.history.back();
  }
  public confirm(){
    let data = {
      status: 'remove',
      orgName: this.routeDetails.orgName
    };
    this.wrapperBuyerAndBothService.manualValidation(this.routeDetails.id, ManualValidationStatus.remove).subscribe({
      next: (response: any) => {
        this.router.navigateByUrl(
          'remove-right-to-buy-success?data=' + btoa(JSON.stringify(data))
        );
      },
      error: (error: any) => {
        this.router.navigateByUrl('buyer-and-both-fail');
      },
    });
 
  }
}
