import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DelegatedRemoveConfirmComponent } from './delegated-remove-confirm.component';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedRemoveConfirmComponent', () => {
  let component: DelegatedRemoveConfirmComponent;
  let fixture: ComponentFixture<DelegatedRemoveConfirmComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;
  let delegatedServiceSpy: jasmine.SpyObj<WrapperUserDelegatedService>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const delegatedServiceSpyObj = jasmine.createSpyObj(
      'WrapperUserDelegatedService',
      ['deleteDelegatedUser', 'resentActivationLink']
    );

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DelegatedRemoveConfirmComponent],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ data: 'exampleData' }) },
        },
        {
          provide: WrapperUserDelegatedService,
          useValue: delegatedServiceSpyObj,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DelegatedRemoveConfirmComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
    delegatedServiceSpy = TestBed.inject(
      WrapperUserDelegatedService
    ) as jasmine.SpyObj<WrapperUserDelegatedService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    component.ngOnInit();

    expect(component.organisationId).toBeDefined();
    expect(component.RouteData).toEqual({});
  });

  it('should parse query parameters and decode username on ngOnInit', () => {
    spyOn(window, 'atob').and.returnValue('{"userName": "exampleUserName"}');
    spyOn(window, 'decodeURIComponent').and.returnValue('decodedUsername');

    component.ngOnInit();

    expect(component.RouteData.userName).toBe('decodedUsername');
  });

  it('should navigate to delegated-success after confirming remove user', () => {
    const response = { success: true };
    delegatedServiceSpy.deleteDelegatedUser.and.returnValue(of(response));

    component.ConfirmRemoveUser();

    expect(component.RouteData.userName).toBe('exampleUserName');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      'delegated-success?data=exampleData'
    );
  });

  it('should navigate to delegated-error if remove user request fails', () => {
    const error = { message: 'Error occurred' };
    delegatedServiceSpy.deleteDelegatedUser.and.returnValue(throwError(error));

    component.ConfirmRemoveUser();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('delegated-error');
  });

  it('should navigate to delegated-error if resend link request fails', () => {
    const error = { message: 'Error occurred' };
    delegatedServiceSpy.resentActivationLink.and.returnValue(throwError(error));

    component.ConfirmResentLink();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('delegated-error');
  });

  it('should navigate back in history on Cancel', () => {
    spyOn(window.history, 'back');

    component.Cancel();

    expect(window.history.back).toHaveBeenCalled();
  });
});
