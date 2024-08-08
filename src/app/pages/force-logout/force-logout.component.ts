import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-force-logout',
  templateUrl: './force-logout.component.html',
  styleUrls: ['./force-logout.component.scss']
})
export class ForceLogoutComponent implements OnInit {

  constructor(private authservice:AuthService) { }

  ngOnInit(): void {
    this.authservice.logOutAndRedirect();    
  }

}
