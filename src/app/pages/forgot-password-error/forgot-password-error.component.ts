import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-forgot-password-error',
  templateUrl: './forgot-password-error.component.html',
  styleUrls: ['./forgot-password-error.component.scss']
})
export class ForgotPasswordErrorComponent implements OnInit {

  constructor(private router: Router, private dataLayerService: DataLayerService) { }

  ngOnInit(): void {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
       event: "page_view" ,
       page_location: this.router.url.toString(),
       user_name: localStorage.getItem("user_name"),
       cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
     });
    })
  }

  onBack(){
    window.history.back();
  }
}
