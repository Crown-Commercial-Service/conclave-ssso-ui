import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationSuccessComponent } from './operation-success.component';
import { StoreModule } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { TokenService } from 'src/app/services/auth/token.service';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('OperationSuccessComponent', () => {
  let component: OperationSuccessComponent;
  let fixture: ComponentFixture<OperationSuccessComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationSuccessComponent ],
      imports:[
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers:[
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        TokenService,
        RollbarErrorService,
        { provide: RollbarService, useValue: rollbarFactory() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })    
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSuccessComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
