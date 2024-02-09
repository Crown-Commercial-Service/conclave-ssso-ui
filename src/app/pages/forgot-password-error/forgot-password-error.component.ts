import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-forgot-password-error',
  templateUrl: './forgot-password-error.component.html',
  styleUrls: ['./forgot-password-error.component.scss']
})
export class ForgotPasswordErrorComponent implements OnInit {

  constructor(private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) { }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
  }

  onBack(){
    window.history.back();
  }
}
