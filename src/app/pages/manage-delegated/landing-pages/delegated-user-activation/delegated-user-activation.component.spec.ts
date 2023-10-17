import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DelegatedUserActivationComponent } from './delegated-user-activation.component';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

describe('DelegatedUserActivationComponent', () => {
  let component: DelegatedUserActivationComponent;
  let fixture: ComponentFixture<DelegatedUserActivationComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockDelegatedService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({ activationcode: '123456' }),
    };

    mockRouter = jasmine.createSpyObj(['navigate']);

    mockDelegatedService = jasmine.createSpyObj(['activateUser']);
    mockDelegatedService.activateUser.and.returnValue(of({}));

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activate user on initialization', () => {
    expect(mockDelegatedService.activateUser).toHaveBeenCalledWith('123456');
  });

  it('should set userActivation to true if activation is successful', () => {
    expect(component.userActivation).toBe(true);
  });

  it('should set userActivation to false if activation fails', () => {
    mockDelegatedService.activateUser.and.returnValue(throwError('Error'));
    fixture = TestBed.createComponent(DelegatedUserActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.userActivation).toBe(false);
  });
});
