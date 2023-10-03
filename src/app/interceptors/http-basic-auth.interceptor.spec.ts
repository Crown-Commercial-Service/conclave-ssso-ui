import { HttpBasicAuthInterceptor } from './http-basic-auth.interceptor';

describe('HttpBasicAuthInterceptor', () => {
  it('create an instance', () => {
    const interceptor = new HttpBasicAuthInterceptor(); 
    expect(interceptor).toBeTruthy();
  });
});