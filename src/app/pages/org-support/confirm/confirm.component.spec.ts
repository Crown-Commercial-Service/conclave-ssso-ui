import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { OrgSupportConfirmComponent } from './confirm.component';
import { MFAService } from 'src/app/services/auth/mfa.service';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('OrgSupportConfirmComponent', () => {
  let component: OrgSupportConfirmComponent;
  let fixture: ComponentFixture<OrgSupportConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [OrgSupportConfirmComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (fn: (value: any) => void) =>
                fn({
                  rpwd: 'true',
                  rmfa: 'false',
                  chrole: 'assign',
                }),
            },
          },
        },
        MFAService,
        { provide: Store, useFactory: () => ({}) },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties correctly', () => {
    expect(component.changePassword).toBe(true);
    expect(component.resetMfa).toBe(false);
    expect(component.changeRoleType).toBe('assign');
    expect(component.displayMessage).toBe(
      'Confirm you want to  assign admin role, change the password for .'
    );
    expect(component.userName).toBe('');
    expect(component.canContinue).toBe(true);
  });

  it('should navigate to details page on cancel click', () => {
    spyOn(component['router'], 'navigateByUrl');
    component.onCancelClick('Cancel');
    expect(component['router'].navigateByUrl).toHaveBeenCalledWith(
      `org-support/details?rpwd=true&rmfa=false&chrole=assign&deuser=false&reuser=false`
    );
  });
});
