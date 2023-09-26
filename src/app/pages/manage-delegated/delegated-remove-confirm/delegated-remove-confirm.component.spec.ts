import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { DelegatedRemoveConfirmComponent } from './delegated-remove-confirm.component';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

describe('DelegatedRemoveConfirmComponent', () => {
  let component: DelegatedRemoveConfirmComponent;
  let fixture: ComponentFixture<DelegatedRemoveConfirmComponent>;
  let mockDelegatedService: Partial<WrapperUserDelegatedService>;

  beforeEach(async () => {
    mockDelegatedService = {
      deleteDelegatedUser: jest.fn(),
      resentActivationLink: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DelegatedRemoveConfirmComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                data: 'encoded-data',
              }),
              queryParams: {
                data: 'encoded-data',
              },
            },
          },
        },
        {
          provide: WrapperUserDelegatedService,
          useValue: mockDelegatedService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedRemoveConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    expect(component.organisationId).toBeDefined();
    expect(component.RouteData).toBeUndefined();

    component.ngOnInit();

    expect(component.RouteData).toBeDefined();
    expect(component.RouteData.userName).toBeDefined();
  });

  it('should confirm and remove user', () => {
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');
    const deleteDelegatedUserSpy = jest.spyOn(
      component.DelegatedService,
      'deleteDelegatedUser'
    );

    component.RouteData = {
      userName: 'test-user',
      pageaccessmode: 'remove',
    };

    component.ConfirmRemoveUser();

    expect(deleteDelegatedUserSpy).toHaveBeenCalledWith(
      'test-user',
      component.organisationId
    );
    expect(routerSpy).toHaveBeenCalledWith(
      'delegated-success?data=encoded-data'
    );
  });

  it('should confirm and resend activation link', () => {
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');
    const resentActivationLinkSpy = jest.spyOn(
      component.DelegatedService,
      'resentActivationLink'
    );

    component.RouteData = {
      userName: 'test-user',
      pageaccessmode: 'resent',
    };

    component.ConfirmResentLink();

    expect(resentActivationLinkSpy).toHaveBeenCalledWith(
      'test-user',
      component.organisationId
    );
    expect(routerSpy).toHaveBeenCalledWith(
      'delegated-success?data=encoded-data'
    );
  });

  it('should cancel and go back', () => {
    const historySpy = jest.spyOn(window.history, 'back');

    component.Cancel();

    expect(historySpy).toHaveBeenCalled();
  });
});
