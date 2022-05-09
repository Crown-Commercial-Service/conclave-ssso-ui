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

  public RollbarDebug(error: string):void{
    if(this.security_log){
      this.rollbar.debug(error)
    }
  } 
  
  public rollBarHttp(error: string,data:any):void{
    if(this.security_log){
      this.rollbar.debug(error)
    }
  }  
}
