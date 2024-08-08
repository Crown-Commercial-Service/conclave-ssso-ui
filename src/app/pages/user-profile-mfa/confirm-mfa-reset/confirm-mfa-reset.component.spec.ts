import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmMfaResetComponent } from './confirm-mfa-reset.component';
import { MFAService } from 'src/app/services/auth/mfa.service';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('ConfirmMfaResetComponent', () => {
  let component: ConfirmMfaResetComponent;
  let fixture: ComponentFixture<ConfirmMfaResetComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mfaServiceSpy: jasmine.SpyObj<MFAService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const mfaServiceSpyObj = jasmine.createSpyObj('MFAService', [
      'sendResetMFANotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ConfirmMfaResetComponent],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ data: 'testData' }) },
        },
        { provide: MFAService, useValue: mfaServiceSpyObj },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMfaResetComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mfaServiceSpy = TestBed.inject(MFAService) as jasmine.SpyObj<MFAService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to success page on successful MFA reset', () => {
    const decodedData = { data: 'testData' };
    component.decodedData = decodedData;
    mfaServiceSpy.sendResetMFANotification.and.returnValue(of(null));

    component.navigateTosuccess('Save and continue');

    expect(mfaServiceSpy.sendResetMFANotification).toHaveBeenCalledWith(
      decodedData.data
    );
  });

  it('should navigate to success page with error on failed MFA reset', () => {
    const decodedData = { data: 'testData' };
    component.decodedData = decodedData;
    const error = 'Error occurred';
    mfaServiceSpy.sendResetMFANotification.and.returnValue(throwError(error));

    component.navigateTosuccess('Save and continue');

    expect(mfaServiceSpy.sendResetMFANotification).toHaveBeenCalledWith(
      decodedData.data
    );
  });

  it('should navigate back on cancel', () => {
    spyOn(window.history, 'back');

    component.OnCancel('Cancel');

    expect(window.history.back).toHaveBeenCalled();
  });
});
