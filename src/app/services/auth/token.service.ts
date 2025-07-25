import { Injectable } from "@angular/core";
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class TokenService {
  constructor() {
  }

  getDecodedToken(token: string): any {
    try {
      let jwtToken = jwtDecode(token);
      return jwtToken
    }
    catch (Error) {
      return null;
    }
  }

  getCiiOrgId() {
    let ciiOrgId = localStorage.getItem('cii_organisation_id')
    return ciiOrgId || '';
  }

  getAccessTokenExpiration(): any {
    let exp = localStorage.getItem('at_exp')
    return exp;
  }
}