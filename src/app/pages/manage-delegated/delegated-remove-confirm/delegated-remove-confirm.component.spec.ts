import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { DelegatedRemoveConfirmComponent } from './delegated-remove-confirm.component';

describe('DelegatedRemoveConfirmComponent', () => {
  let component: DelegatedRemoveConfirmComponent;
  let fixture: ComponentFixture<DelegatedRemoveConfirmComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeStub: Partial<ActivatedRoute>;
  let delegatedServiceSpy: jasmine.SpyObj<WrapperUserDelegatedService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    routeStub = {
      queryParams: {
        subscribe: (fn: (value: any) => void) => {
          fn({ data: 'exampleData' });
        },
      },
    };
    delegatedServiceSpy = jasmine.createSpyObj('WrapperUserDelegatedService', [
      'deleteDelegatedUser',
      'resentActivationLink',
    ]);

    TestBed.configureTestingModule({
      declarations: [DelegatedRemoveConfirmComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: WrapperUserDelegatedService, useValue: delegatedServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DelegatedRemoveConfirmComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', () => {
    const queryParams = { data: 'exampleData' };
    component.ngOnInit();
    expect(component.RouteData).toEqual(JSON.parse(atob(queryParams.data)));
    expect(component.RouteData.userName).toEqual(
      decodeURIComponent(unescape(component.RouteData.userName))
    );
  });

  it('should confirm remove user', () => {
    const data = {
      status: 'delete',
      userName: component.RouteData.userName,
    };
    component.ConfirmRemoveUser();
    expect(delegatedServiceSpy.deleteDelegatedUser).toHaveBeenCalledWith(
      component.RouteData.userName,
      component.organisationId
    );
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      'delegated-success?data=' + btoa(JSON.stringify(data))
    );
  });

  it('should confirm resent link', () => {
    const data = {
      status: 'resent',
      userName: component.RouteData.userName,
    };
    component.ConfirmResentLink();
    expect(delegatedServiceSpy.resentActivationLink).toHaveBeenCalledWith(
      component.RouteData.userName,
      component.organisationId
    );
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      'delegated-success?data=' + btoa(JSON.stringify(data))
    );
  });

  it('should cancel and go back', () => {
    component.Cancel();
    expect(window.history.back).toHaveBeenCalled();
  });
});
