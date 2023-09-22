import { HttpJwtAuthInterceptor } from './http-jtw-auth.interceptor';
import { AuthService } from '../services/auth/auth.service';
import { WorkerService } from '../services/worker.service';

describe('HttpJwtAuthInterceptor', () => {
    let interceptor: HttpJwtAuthInterceptor;
  let workerService: WorkerService;
  let authService: AuthService;
  it('should create an instance', () => {
    const interceptor = new HttpJwtAuthInterceptor(workerService,authService);
    expect(interceptor).toBeTruthy();
  });
});