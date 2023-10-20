import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceCheck implements CanActivate {

  constructor() { }

  public canActivate(): boolean {
    var isMaintenance = environment.appSetting.isMaintenance;
    if(isMaintenance){
      window.location.href = 'maintenance';
      return false;  
    }
    return true;
  }
}
