import {
  Injectable,
  Inject,
  InjectionToken,
  ErrorHandler,
} from '@angular/core';

import * as Rollbar from 'rollbar';


import { environment } from 'src/environments/environment';

const rollbarConfig = {
  accessToken: environment.rollbar.key,

  captureUncaught: true,

  captureUnhandledRejections: true,
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  private rollbarEnvironment = environment.rollbar.environment;

  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

  handleError(err: any): void {
    if (environment.rollbar.enable) {
      this.rollbar.configure({
        logLevel: 'info',
        payload: { environment: this.rollbarEnvironment },
      });

      this.rollbar.error(err.originalError || err);
    } else {
      console.log('logging:' + err);
    }
  }
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}
