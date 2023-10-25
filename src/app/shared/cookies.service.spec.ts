import { TestBed } from '@angular/core/testing';
import { CookiesService } from './cookies.service';

describe('CookiesService', () => {
  let service: CookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookiesService);
  });

  it('should retrieve a cookie value', () => {
    document.cookie = 'testCookie=testValue';

    const result = service.getCookie('testCookie');

    expect(result).toEqual('testValue');
  });

  it('should set a cookie with the provided value and expiration time', () => {
    const cname = 'testCookie';
    const cvalue = 'testValue';
    const exmin = 10;

    service.setCookie(cname, cvalue, exmin);

    const cookies = document.cookie.split(';');
    const cookie = cookies.find((c) => c.trim().startsWith(`${cname}=`));
    expect(cookie).toBeDefined();
    expect(cookie?.trim()).toContain(`${cname}=${cvalue}`);
  });

  it('should delete additional Google Analytics cookies', (done) => {
    spyOn(service, 'setSessionCookie');
    service.deleteAdditionalCookies();
    setTimeout(() => {
      expect(service.setSessionCookie).toHaveBeenCalledTimes(
        service.googleAnalyticsCookies.length
      );
      service.googleAnalyticsCookies.forEach((cookie) => {
        expect(service.setSessionCookie).toHaveBeenCalledWith(
          cookie,
          'removed',
          service.cookieExpirationTimeInMinutes
        );
      });
      done();
    }, 600);
  });

  it('should delete GlassBox cookies', (done) => {
    spyOn(service, 'setSessionCookie');

    service.deleteGlassBoxCookies();

    setTimeout(() => {
      expect(service.setSessionCookie).toHaveBeenCalledTimes(
        service.glassBoxCookies.length
      );
      service.glassBoxCookies.forEach((cookie) => {
        expect(service.setSessionCookie).toHaveBeenCalledWith(
          cookie,
          'removed',
          service.cookieExpirationTimeInMinutes
        );
      });
      done();
    }, 600);
  });
});
