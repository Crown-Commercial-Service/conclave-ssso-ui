import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

import { User, UserProfileRequestInfo } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { ContactReason } from 'src/app/models/contactDetail';
import { IdentityProvider } from 'src/app/models/identityProvider';
import { ContryDetails } from 'src/app/models/contryDetails';

@Injectable({
  providedIn: 'root'
})
export class WrapperConfigurationService {
  public url: string = `${environment.uri.api.isApiGateWayEnabled ?
    environment.uri.api.wrapper.apiGatewayEnabled.configuration : environment.uri.api.wrapper.apiGatewayDisabled.configuration}`;

  private options = {
    headers: new HttpHeaders()
  }

  constructor(private http: HttpClient) {
  }



  getIdentityProviders(): Observable<any> {
    let tempData:IdentityProvider[]=[]
    const url = `${this.url}/identity-providers`;
    return this.http.get<IdentityProvider[]>(url, this.options).pipe(
      map((data: IdentityProvider[]) => {
        if(environment.appSetting.hideIDP){
          data.map((f: IdentityProvider) => {
            if (f.name === 'User ID and password') {
                tempData.push(f)
            }
        })
           return tempData;
        } else {
          return data
        }
      }), catchError(error => {
        return throwError(error);
      })
    );
  }

  getRoles(): Observable<any> {
    if(!environment.appSetting.hideSimplifyRole){
      const structureData:any = []
      const url = `${this.url}/servicerolegroups`;
      return this.http.get<any[]>(url, this.options).pipe(
        map((data: any[]) => {
          data.forEach((f)=>{
            let structureObj = {
              roleId: f.id,
              roleKey:f.key,
              roleName: f.name,
              orgTypeEligibility: f.orgTypeEligibility,
              subscriptionTypeEligibility: f.subscriptionTypeEligibility,
              tradeEligibility: f.tradeEligibility,
              description : f.description,
              autoValidationRoleTypeEligibility:f.autoValidationRoleTypeEligibility
            }
            structureData.push(structureObj)
          })
          return structureData;
        }), catchError(error => {
          return throwError(error);
        })
      );
    } else {
      const url = `${this.url}/roles`;
      return this.http.get<any[]>(url, this.options).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError(error);
        })
      );
    }
  }

  getCountryDetails(): Observable<ContryDetails[]> {
    const url = `${this.url}/country-details`;
    return this.http.get<ContryDetails[]>(url, this.options).pipe(
      map((data: ContryDetails[]) => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

}