import { BehaviorSubject } from 'rxjs';
import {LoadingIndicatorInterceptor } from './loading-indicator.interceptor';

class LoadingIndicatorServiceMock
{
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
}

describe('LoadingIndicatorInterceptor', () => {
   const loadingIndicatorServiceMock = new LoadingIndicatorServiceMock();
  it('create an instance', () => {
    const interceptor = new LoadingIndicatorInterceptor(loadingIndicatorServiceMock); 
    expect(interceptor).toBeTruthy();
  });
});