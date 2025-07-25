import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, Subject, throwError, of } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { PasswordChangeDetail } from 'src/app/models/passwordChangeDetail';
import { TokenInfo } from 'src/app/models/auth';
import { TokenService } from './token.service';
import { ServicePermission } from 'src/app/models/servicePermission';
import { CcsServiceInfo } from 'src/app/models/configurations';
import { WorkerService } from '../worker.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { SessionService } from 'src/app/shared/session.service';
import { LoadingIndicatorService } from 'src/app/services/helper/loading-indicator.service';

@Injectable()
export class AuthService {

  public url: string = environment.uri.api.security;
  public authTokenRenewaltimerReference: any = undefined;
  servicePermission: ServicePermission[];
  ccsServices: CcsServiceInfo[] = [];

  constructor(public readonly workerService: WorkerService, private router: Router, private location: Location,private RollbarErrorService:RollbarErrorService,
    private readonly httpService: HttpClient, private readonly tokenService: TokenService,private sessionService:SessionService,private loadingIndicatorService: LoadingIndicatorService) {
    this.servicePermission = [];
  }

  login(username: string, password: string) {
    var url = environment.uri.web.dashboard + '/authsuccess?code=' + username;
    window.location.href = url;
  }

  public isUserAuthenticated() {
    const tokens = this.sessionService.decrypt('user_name')    
    return tokens != null && tokens != '';
  }

  public async isInMemoryTokenExists(): Promise<boolean> {
    let at = await this.workerService.checkAccessToken();
    return at;
  }

  public getCcsServices() {
    if (this.ccsServices.length == 0) {
      return this.httpService.get(`${environment.uri.api.isApiGateWayEnabled ?
        environment.uri.api.wrapper.apiGatewayEnabled.configuration : environment.uri.api.wrapper.apiGatewayDisabled.configuration}/services`).pipe(
          map(data => {
            return data;
          }));
    }
    return of(this.ccsServices);
  }

  public registerTokenRenewal() {
    if (this.authTokenRenewaltimerReference == undefined) {
      let thisVar = this;
      this.authTokenRenewaltimerReference = setInterval(function () {
        let exp = thisVar.tokenService.getAccessTokenExpiration();
        if (exp != null) {
          let expireDate = new Date(exp * 1000);
          var date = new Date();
          let diffInMinutes = Math.floor((expireDate.getTime() - date.getTime()) / 60000);

          // If token expiration is less than 10 minutes, trigger token renewal 
          if (diffInMinutes <= 10) {
            thisVar.renewAccessToken();
          }
        }
        else {
          thisVar.renewAccessToken();
        }
      }, 300000); // execute every 5 minutes (60000*5)
    }
  }

  renewAccessToken(url: string = '') {
    let data: any    
    data = this.getRefreshToken().toPromise().then((refreshToken: any) => {
    return this.renewToken(refreshToken || '').toPromise().then((tokenInfo) => {
        if (!tokenInfo) return;
        this.workerService.storeTokenInWorker(tokenInfo);
        return this.createSession(tokenInfo.refresh_token).toPromise().then(() => {
          let decodedAccessToken = this.tokenService.getDecodedToken(tokenInfo.access_token);
          localStorage.setItem('at_exp', decodedAccessToken.exp);
          localStorage.setItem('show_loading_indicator', 'false');
          if (url.length > 0) {
            this.loadingIndicatorService.isLoading.next(false);
            this.loadingIndicatorService.isCustomLoading.next(false);
            this.router.navigateByUrl(url, { replaceUrl: true });
          }
        this.RollbarErrorService.RollbarDebug('renewAccessToken:'+ JSON.stringify(data))
        });
      },
        (err) => {
          localStorage.setItem('show_loading_indicator', 'false');
          this.loadingIndicatorService.isLoading.next(false);
          this.loadingIndicatorService.isCustomLoading.next(false);
         this.RollbarErrorService.RollbarDebug('renewAccessTokenError:'+ JSON.stringify(err))
          // This could due to invalid refresh token (refresh token rotation)  
          if (err.error == "INVALID_CREDENTIALS" || err.error.error_description == "PENDING_PASSWORD_CHANGE"
            || err.error.error == 'invalid_grant' || err.error.error == 'invalid_request') {
            // sign out the user
            this.logOutAndRedirect();
          }
        })
    }).catch((error: any) => {
      localStorage.setItem('show_loading_indicator', 'false');
      this.RollbarErrorService.RollbarDebug('renewAccessTokenError:' + JSON.stringify(error))
      if (error.status == 404) {
        window.location.href = this.getAuthorizedEndpoint();
      }
    });
  }

  private authSuccessSource = new Subject<boolean>();

  // Observable string streams
  userAutnenticated$ = this.authSuccessSource.asObservable();

  publishAuthStatus(authSuccess: boolean) {
    this.authSuccessSource.next(authSuccess);
  }

  public isAuthenticated(): Observable<boolean> {
    const tokens = this.sessionService.decrypt('user_name')
    if (tokens) {
      return of(true);
    }
    return of(false);
  }

  changePassword(passwordChangeDetail: PasswordChangeDetail): Observable<any> {
    return this.httpService.post(`${environment.uri.api.postgres}/authorization/passwords`, passwordChangeDetail).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  resetPassword(userName: string): Observable<any> {
    var changepwd = { "userName": userName }
    return this.httpService.post(`${this.url}/security/users/reset`, changepwd);
  }

  token(code: string): Observable<any> {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded')
    }
    let body = `client_id=${environment.idam_client_id}&code=${code}&grant_type=authorization_code&code_verifier=${this.getCodeVerifier()}&redirect_uri=${environment.uri.web.dashboard + '/authsuccess'}`;
    this.RollbarErrorService.RollbarDebug('Token_req:'+ body)
    return this.httpService.post(`${this.url}/security/token`, body, options).pipe(
      map(data => {
       this.RollbarErrorService.RollbarDebug('Token_res:'+ JSON.stringify(data)) 
        return data;
      }),
      catchError(error => {
       this.RollbarErrorService.RollbarDebug('Token_error:' + JSON.stringify(error))
        return throwError(error);
      })
    );
  }

  renewToken(refreshToken: string): Observable<TokenInfo> {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded')
    }
    let delegated_org_id = localStorage.getItem('delegatedOrg');
    delegated_org_id = delegated_org_id == null || delegated_org_id == 'undefined' ? '' : delegated_org_id;
    let body = `client_id=${environment.idam_client_id}&refresh_token=${refreshToken}&delegated_org_id=${delegated_org_id}&grant_type=refresh_token`;
    this.RollbarErrorService.RollbarDebug('renewToken:'+ body)
    return this.httpService.post<TokenInfo>(`${this.url}/security/token`, body, options);
    
  }

// The "isLogin" flag is added to prevent force logout from occurring during the user's first login. 
  createSession(refreshToken: string, isLogin: boolean = false) {
    var options = {
      headers: new HttpHeaders().append('x-is-login', isLogin ? 'true' : 'false')
    }
    let coreDataUrl: string = `${environment.uri.api.postgres}/authorization/sessions`;
    const body = {
      'refreshToken': refreshToken
    }
    return this.httpService.post(coreDataUrl, body, options).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getRefreshToken() {
    const options = {
      headers: new HttpHeaders().append('responseType', 'text')
    }
    let coreDataUrl: string = `${environment.uri.api.postgres}/authorization/refresh-tokens`;
    return this.httpService.get(coreDataUrl, { responseType: 'text' });
  }

  getSignOutEndpoint() {
    return environment.uri.api.security + '/security/log-out?client-id=' + environment.idam_client_id
      + '&redirect-uri=' + environment.uri.web.dashboard;
  }

  getAuthorizedEndpoint() {
    let codeVerifier = this.getCodeVerifier();
    const codeVerifierHash = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64);
    const codeChallenge = codeVerifierHash
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    let url = environment.uri.api.security + '/security/authorize?scope=email profile openid offline_access&response_type=code&client_id='
      + environment.idam_client_id
      + '&code_challenge_method=S256' + '&code_challenge=' + codeChallenge
      + '&redirect_uri=' + environment.uri.web.dashboard + '/authsuccess'
     this.RollbarErrorService.RollbarDebug("getAuthorizedEndpoint:"+url)
    return url;
  }

  getCodeVerifier() {
    let codeVerifier = localStorage.getItem('codeVerifier');
    if (codeVerifier == undefined || codeVerifier == '') {
      codeVerifier = this.generateRandom(128);
      localStorage.setItem('codeVerifier', codeVerifier);
    }
    return codeVerifier;
  }

  generateRandom(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  public signOut() {
    clearTimeout(this.authTokenRenewaltimerReference);
    localStorage.removeItem('user_name');
    localStorage.removeItem('ccs_organisation_id');
    localStorage.removeItem('cii_organisation');
    localStorage.removeItem('brickendon_org_reg_email_address');
    localStorage.removeItem('codeVerifier');
    localStorage.removeItem('securityapiurl');
    localStorage.removeItem('redirect_uri');
    localStorage.removeItem('client_id');
    localStorage.removeItem('currentGlobalRoute');
    localStorage.removeItem('cii_organisation_id');
    localStorage.removeItem('at_exp');
    localStorage.removeItem('permission_organisation_id');
    localStorage.removeItem('delegatedOrg');
    localStorage.removeItem('routeRecords');
    localStorage.removeItem('user_approved_role');
    localStorage.removeItem('user_access_name');
    localStorage.removeItem('userEditDetails');
    localStorage.removeItem('roleForGroup');
    localStorage.removeItem('user_contact_user_name');
    sessionStorage.removeItem('user_contact_user_name');
    localStorage.removeItem('isDormant');
  }

  public logOutAndRedirect() {
    this.RollbarErrorService.RollbarDebug("logOutAndRedirect")
    return this.clearRefreshToken().toPromise().then(() => {
      this.signOut();
      window.location.href = this.getSignOutEndpoint();
    }),
      catchError(error => {
        return throwError(error);
      });
  }

  clearRefreshToken() {
    let coreDataUrl: string = `${environment.uri.api.postgres}/authorization/sign-out`;
    return this.httpService.post(coreDataUrl, null);
  }

  public setWindowLocationHref(href: string) {
    window.location.href = href;
  }

  getPermissions(accessPage:string): Observable<any> {
    if (this.servicePermission.length == 0 || accessPage === 'HOME') {
      return this.httpService.get<ServicePermission[]>(`${environment.uri.api.postgres}/users/permissions?user-name=`
        + encodeURIComponent(this.sessionService.decrypt('user_name')) + `&service-client-id=` + environment.idam_client_id +'&organisation-id='+ localStorage.getItem('permission_organisation_id') || "").pipe(
          map((data: ServicePermission[]) => {
            // Cache permissions locally
            this.servicePermission = data;
            localStorage.setItem('isOrgAdmin', JSON.stringify(this.servicePermission.some(x => x.roleKey === "ORG_ADMINISTRATOR")));
            return data;
          }),
          catchError(error => {
            return throwError(error);
          })
        );
    }
    else {
      return of(this.servicePermission);
    }
  }

  hasPermission(permissionName: string) {
    return this.getPermissions('Null').pipe(
      map((rolePermissions: ServicePermission[]) => {
        // Get the all the roles available for the permission
        var rolesWithThePermission = rolePermissions.filter(rp => rp.permissionName == permissionName);
        return rolesWithThePermission.length != 0;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  nominate(email: string): Observable<any> {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }
    const body = { email }
    return this.httpService.post(`${environment.uri.api.postgres}/users/nomination`, JSON.stringify(email), options).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  getMfaAuthorizationEndpoint()
  {
    let url = environment.uri.api.security + '/security/mfa/authorize?scope=email profile openid offline_access&response_type=code&client_id='
      + environment.idam_client_id
      + '&redirect_uri=' + environment.uri.web.dashboard + '/mfa-selection'
    return url;
  }
  mfatoken(code: string): Observable<any> {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded')
    }
    let body = `client_id=${environment.idam_client_id}&code=${code}&grant_type=authorization_code&code_verifier=${this.getCodeVerifier()}&redirect_uri=${environment.uri.web.dashboard + '/mfa-selection'}`;
    this.RollbarErrorService.RollbarDebug('Token_req:'+ body)
    return this.httpService.post(`${this.url}/security/mfa/token`, body, options).pipe(
      map(data => {
       this.RollbarErrorService.RollbarDebug('Token_res:'+ JSON.stringify(data)) 
        return data;
      }),
      catchError(error => {
       this.RollbarErrorService.RollbarDebug('Token_error:' + JSON.stringify(error))
        return throwError(error);
      })
    );
  }

  mfarenewtoken(refreshToken: string): Observable<any>{
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded')
    }
    let tokenBody = {        
      "auth0_refresh_token": refreshToken,
      "clientid": environment.idam_client_id
    }
    return this.httpService.post(`${this.url}/security/mfa/verify`, tokenBody).pipe(
      map(data => {
      //  this.RollbarErrorService.RollbarDebug('Token_res:'+ JSON.stringify(data)) 
        return data;
      }),
      catchError(error => {
       this.RollbarErrorService.RollbarDebug('Token_error:' + JSON.stringify(error))
        return throwError(error);
      })
    );  
  }
  Associate(accessToken: string, phoneNumber: string, isSms: boolean = false): Observable<any> {

    let tokenBody = {     
      "authenticator_types": isSms ? ["oob"] : ["otp"],
      "oob_channels":["sms"],
      "phone_number": phoneNumber,
      "access_token": accessToken
    }
    return this.httpService.post(`${this.url}/security/mfa/enrollment`, tokenBody).pipe(

      map(data => {
        
        return data;

      }),

      catchError(error => {

        return throwError(error);

      })

    );

  }

  VerifyOTP(otp: string, token:string, oob_code: string, auth_type: string): Observable<any> {

    let tokenBody = {
      "mfa_token": token,
      "otp": otp,
      "oob_code": oob_code  ,
      "auth_type" : auth_type
    }
    return this.httpService.post(`${this.url}/security/mfa/verifyotp`, tokenBody).pipe(
      map(data => {
        return data;
      }),

      catchError(error => {
        return throwError(error);
      })

    );

  }
  GetMfaAuthenticationType (userId:string) : Observable<any>
  {
   let UserEnrollmentDTO = {userId : userId}
    return this.httpService.post(`${this.url}/security/mfa/user/enrollment`,UserEnrollmentDTO).pipe(
      map(data =>{
        return data;
      }),
      catchError(error =>{
        
        return throwError(error);
      })
    )
  }
  
  useTokenFromStorage(){
    var token = localStorage.getItem('STORE_TOKEN_ACCESS_TOKEN');
    var refreshToken = localStorage.getItem('STORE_TOKEN_ACCESS_TOKEN');
    if(token != undefined && token != '')
    {
        let tokeInfor : TokenInfo = {
            access_token : token || '',
            refresh_token: refreshToken || '',
            auth0_access_token : '',
            auth0_refresh_token : '',
            challengeName : '',
            challengeRequired : false,
            id_token: '',
            session_state: '',
            sessionId: ''
        };
        this.workerService.storeTokenInWorker(tokeInfor);
    }
  }
}