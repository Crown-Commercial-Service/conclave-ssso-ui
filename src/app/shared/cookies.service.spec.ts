import { TestBed } from '@angular/core/testing';
import { CookiesService } from './cookies.service';

describe('CookiesService', () => {
  let service: CookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a cookie value', () => {
    document.cookie = 'testCookie=testValue';
    const cookieValue = service.getCookie('testCookie');
    expect(cookieValue).toBe('testValue');
  });

  it('should set a cookie', () => {
    service.setCookie('testCookie', 'testValue', 10);
    const cookieValue = service.getCookie('testCookie');
    expect(cookieValue).toBe('testValue');
  });

  it('should set a session cookie', () => {
    service.setSessionCookie('testCookie', 'testValue', 10);
    const cookieValue = service.getCookie('testCookie');
    expect(cookieValue).toBe('testValue');
  });

  it('should delete a cookie', () => {
    service.deleteCookie('testCookie', 'testValue');
    const cookieValue = service.getCookie('testCookie');
    expect(cookieValue).toBe('testValue');
  });

  it('should delete a session cookie', () => {
    service.deleteSessionCookie('testCookie', 'testValue');
    const cookieValue = service.getCookie('testCookie');
    expect(cookieValue).toBe('testValue');
  });

  it('should delete a none cookie', () => {
    service.deleteNoneCookies('testCookie', 'testValue');
    const cookieValue = service.getCookie('testCookie');
    expect(cookieValue).toBe('testValue');
  });
});
