import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  it('should decode the token correctly', () => {
    const token = 'your_token_here';
    const decodedToken = tokenService.getDecodedToken(token);

    expect(decodedToken).toBeDefined();
  });

  it('should return the CiiOrgId from local storage', () => {
    const ciiOrgId = 'your_cii_org_id_here';
    spyOn(localStorage, 'getItem').and.returnValue(ciiOrgId);

    const result = tokenService.getCiiOrgId();

    expect(result).toBe(ciiOrgId);
  });

  it('should return the access token expiration from local storage', () => {
    const expiration = 'your_access_token_expiration_here';
    spyOn(localStorage, 'getItem').and.returnValue(expiration);

    const result = tokenService.getAccessTokenExpiration();

    expect(result).toBe(expiration);
  });
});
