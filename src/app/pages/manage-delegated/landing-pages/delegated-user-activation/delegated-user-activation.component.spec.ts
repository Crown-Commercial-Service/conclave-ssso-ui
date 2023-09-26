import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DelegatedUserActivationComponent } from './delegated-user-activation.component';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { By } from '@angular/platform-browser';

describe('DelegatedUserActivationComponent', () => {
  let component: DelegatedUserActivationComponent;
  let fixture: ComponentFixture<DelegatedUserActivationComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockDelegatedService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({ activationcode: 'testActivationCode' }),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    mockDelegatedService = {
      activateUser: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DelegatedUserActivationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        {
          provide: WrapperUserDelegatedService,
          useValue: mockDelegatedService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should activate user on component initialization and display success message', () => {
    const mockUserResponse = {
      /* mock user response object */
    };
    mockDelegatedService.activateUser.mockReturnValue(of(mockUserResponse));

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockDelegatedService.activateUser).toHaveBeenCalledWith(
      'testActivationCode'
    );
    expect(component.userActivation).toBe(true);

    const successMessage = fixture.debugElement.query(By.css('.content-left'));
    expect(successMessage).toBeTruthy();
    expect(successMessage.nativeElement.innerText).toContain(
      'You have activated your delegated access.'
    );
  });

  it('should handle error when activating user and display error message', () => {
    const mockError = new Error('Activation Error');
    mockDelegatedService.activateUser.mockReturnValue(throwError(mockError));

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockDelegatedService.activateUser).toHaveBeenCalledWith(
      'testActivationCode'
    );
    expect(component.userActivation).toBe(false);

    const errorMessage = fixture.debugElement.query(
      By.css('.govuk-error-summary__body')
    );
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.innerText).toContain(
      'The activation link for the delegated access is expired.'
    );
  });
});
