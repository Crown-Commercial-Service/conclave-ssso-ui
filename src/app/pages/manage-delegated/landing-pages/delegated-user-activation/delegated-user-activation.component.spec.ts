import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DelegatedUserActivationComponent } from './delegated-user-activation.component';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

describe('DelegatedUserActivationComponent', () => {
  let component: DelegatedUserActivationComponent;
  let fixture: ComponentFixture<DelegatedUserActivationComponent>;
  let mockDelegatedService: jasmine.SpyObj<WrapperUserDelegatedService>;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockDelegatedService = jasmine.createSpyObj('WrapperUserDelegatedService', [
      'activateUser',
    ]);
    mockActivatedRoute = {
      queryParams: of({ activationcode: '12345' }),
    };
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

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

  it('should activate user on initialization', () => {
    const mockUserResponse = {
      /* mock user response object */
    };
    mockDelegatedService.activateUser.and.returnValue(of(mockUserResponse));

    component.ngOnInit();

    expect(mockDelegatedService.activateUser).toHaveBeenCalledWith('12345');
    expect(component.userActivation).toBeTruthy();
  });

  it('should handle error if activation fails', () => {
    const mockError = new Error('Activation failed');
    mockDelegatedService.activateUser.and.returnValue(mockError);

    component.ngOnInit();

    expect(mockDelegatedService.activateUser).toHaveBeenCalledWith('12345');
    expect(component.userActivation).toBeFalsy();
  });
});
