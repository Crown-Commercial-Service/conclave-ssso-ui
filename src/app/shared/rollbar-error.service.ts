import { Inject, Injectable } from '@angular/core';
import * as Rollbar from 'rollbar';
import { environment } from 'src/environments/environment';
import { RollbarService } from '../logging/rollbar';

@Injectable({
  providedIn: 'root'
})
export class RollbarErrorService {
  private  security_log = environment.rollbar.security_log

  constructor(@Inject(RollbarService) private rollbar: Rollbar) { }

  public RollbarDebug():void{
    if(this.security_log){
      // let obj={
      //   errorCode:204,
      //   errorMsg:'my Error'
      // }
      this.rollbar.debug('test-desc-error-ajith')
    }
  }  
}

