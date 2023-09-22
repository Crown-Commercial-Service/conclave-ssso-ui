import { Router } from '@angular/router';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';

describe('ErrorHandlerInterceptor', () => {
    let router: Router;
  it('create an instance', () => {
    const interceptor = new ErrorHandlerInterceptor(router); 
    expect(interceptor).toBeTruthy();
  });
});