import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password-error',
  templateUrl: './forgot-password-error.component.html',
  styleUrls: ['./forgot-password-error.component.scss']
})
export class ForgotPasswordErrorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onBack(){
    window.history.back();
  }
}
