import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FindDelegatedUserComponent } from './find-delegated-user.component';
import { Router } from '@angular/router';

describe('FindDelegatedUserComponent', () => {
  let component: FindDelegatedUserComponent;
  let fixture: ComponentFixture<FindDelegatedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindDelegatedUserComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindDelegatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty email field', () => {
    expect(component.formGroup.get('email')!.value).toEqual('');
  });

  it('should set focus to email field', () => {
    const emailInput = fixture.nativeElement.querySelector('#email');
    spyOn(emailInput, 'focus');
    component.setFocus({});
    expect(emailInput.focus).toHaveBeenCalled();
  });

  it('should validate email length and set error if invalid', () => {
    const emailControl = component.formGroup.get('email')!;
    emailControl.setValue('invalidemail');
    component.validateEmailLength({ target: { value: 'invalidemail' } });
    expect(emailControl.hasError('incorrect')).toBeTrue();
  });

  it('should navigate to delegated-user-status page if user is registered under the same organisation', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    const userResponse = {
      organisationId: 'exampleOrganisationId',
    };
    component.GetUserStatus(component.formGroup);
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'delegated-user-status?data=' + btoa(JSON.stringify(userResponse))
    );
  });

  it('should navigate to delegate-access-user page if user is not registered under the same organisation', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    const userResponse = {
      organisationId: 'differentOrganisationId',
    };
    component.GetUserStatus(component.formGroup);
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'delegate-access-user?data=' + btoa(JSON.stringify(userResponse))
    );
  });

  it('should navigate to previous page on cancel', () => {
    const windowSpy = spyOn(window.history, 'back');
    component.Cancel();
    expect(windowSpy).toHaveBeenCalled();
  });
});
