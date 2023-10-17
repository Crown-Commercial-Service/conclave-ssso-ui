import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  let workerService: WorkerService;
  let mockWorker: any;

  beforeEach(() => {
    mockWorker = jasmine.createSpyObj('Worker', ['postMessage', 'onmessage']);
    workerService = new WorkerService();
    workerService['worker'] = mockWorker;
  });

  it('should get access token', (done) => {
    const accessToken = 'dummyAccessToken';
    mockWorker.onmessage.and.callFake((e: any) => {
      expect(e.data).toBe(accessToken);
      done();
    });

    workerService.getAccessToken().subscribe((result) => {
      expect(result).toBe(accessToken);
    });

    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      command: 'ACCESS_TOKEN',
    });
  });

  it('should check access token', (done) => {
    const isAccessTokenValid = true;
    mockWorker.onmessage.and.callFake((e: any) => {
      expect(e.data).toBe(isAccessTokenValid);
      done();
    });

    workerService.checkAccessToken().then((result) => {
      expect(result).toBe(isAccessTokenValid);
    });

    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      command: 'CHECK_ACCESS_TOKEN',
    });
  });

  it('should store token in worker', () => {
    const tokenInfo = {
      access_token: 'dummyAccessToken',
      refresh_token: 'dummyRefreshToken',
      challengeRequired: false,
      challengeName: 'test name',
      sessionId: 'test sesssion id',
      id_token: 'test id token',
      session_state: 'test session state',
    };
    workerService.storeTokenInWorker(tokenInfo);

    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      command: 'STORE_TOKEN',
      access_token: tokenInfo.access_token,
      refresh_token: tokenInfo.refresh_token,
    });
  });
});
