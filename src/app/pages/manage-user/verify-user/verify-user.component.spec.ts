import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { VerifyUserComponent } from './verify-user.component';

describe('VerifyUserComponent', () => {
  let component: VerifyUserComponent;
  let fixture: ComponentFixture<VerifyUserComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) }
    });
    const routerStub = () => ({ navigateByUrl: (arg: any) => ({}) });
    const wrapperUserServiceStub = () => ({
      addUserTokenVerification: (encryptedtoken: any) => ({ subscribe: (f: any) => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [VerifyUserComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: WrapperUserService, useFactory: wrapperUserServiceStub }
      ]
    });
    fixture = TestBed.createComponent(VerifyUserComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
