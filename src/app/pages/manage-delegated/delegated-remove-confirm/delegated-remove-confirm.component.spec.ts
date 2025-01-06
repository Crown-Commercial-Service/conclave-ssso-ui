import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { DelegatedRemoveConfirmComponent } from './delegated-remove-confirm.component';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedRemoveConfirmComponent', () => {
  let component: DelegatedRemoveConfirmComponent;
  let fixture: ComponentFixture<DelegatedRemoveConfirmComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let delegatedServiceSpy: jasmine.SpyObj<WrapperUserDelegatedService>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', [
      'queryParams',
    ]);
    const delegatedServiceMock = jasmine.createSpyObj(
      'WrapperUserDelegatedService',
      ['deleteDelegatedUser', 'resentActivationLink']
    );

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DelegatedRemoveConfirmComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        {
          provide: WrapperUserDelegatedService,
          useValue: delegatedServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedRemoveConfirmComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
    delegatedServiceSpy = TestBed.inject(
      WrapperUserDelegatedService
    ) as jasmine.SpyObj<WrapperUserDelegatedService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should parse query parameters and update RouteData', () => {
      const queryParams = { data: 'eyJ1c2VyTmFtZSI6InVzZXJOYW1lIn0=' };
      const decodedData = { userName: 'userName' };

      activatedRouteSpy.queryParams = of(queryParams);

      component.ngOnInit();

      expect(component.RouteData).toEqual(decodedData);
    });
  });

  describe('Cancel', () => {
    it('should navigate back in history', () => {
      spyOn(window.history, 'back');

      component.Cancel('Cancel');

      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
