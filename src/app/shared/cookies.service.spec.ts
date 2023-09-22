import { CookiesService } from './cookies.service';

describe('CookiesService', () => {
  it('create an instance', () => {
    const service = new CookiesService();
    expect(service).toBeTruthy();
  });
});
