import { Inject, Injectable } from '@angular/core';
import * as Rollbar from 'rollbar';
import { environment } from 'src/environments/environment';
import { RollbarService } from '../logging/rollbar';

@Injectable({
  providedIn: 'root'
})
export class RollbarErrorService {

  private  security_log = environment.rollbar.security_log
  private  rollbarEnvironment=environment.rollbar.environment
  constructor(@Inject(RollbarService) private rollbar: Rollbar) { }

  public RollbarDebug(data: string):void{
    console.log("this.security_log_start",this.security_log)
    if(this.security_log){
      console.log("this.security_log_end",this.security_log)
      this.rollbar.configure({logLevel: 'info', payload: {environment: this.rollbarEnvironment}});
      this.rollbar.debug(data)
    }
  } 
  
  public rollBarHttp(data: string):void{
    if(this.security_log){
      this.rollbar.configure({logLevel: 'info', payload: {environment: this.rollbarEnvironment}});
      this.rollbar.debug(data)
    }
  } 
}
