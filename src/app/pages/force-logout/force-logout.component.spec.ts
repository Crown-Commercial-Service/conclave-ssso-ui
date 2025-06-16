import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceLogoutComponent } from './force-logout.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { rollbarFactory, RollbarService } from 'src/app/logging/rollbar';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TokenService } from 'src/app/services/auth/token.service';

describe('ForceLogoutComponent', () => {
  let component: ForceLogoutComponent;
  let fixture: ComponentFixture<ForceLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForceLogoutComponent ],
      imports: [
        HttpClientTestingModule
      ],
      providers:[
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
