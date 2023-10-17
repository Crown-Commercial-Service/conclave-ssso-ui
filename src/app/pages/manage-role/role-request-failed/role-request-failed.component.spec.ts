import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RoleRequestFailedComponent } from './role-request-failed.component';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('RoleRequestFailedComponent', () => {
  let component: RoleRequestFailedComponent;
  let fixture: ComponentFixture<RoleRequestFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [RoleRequestFailedComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (callback: (params: any) => void) => {
                callback({
                  data: btoa(
                    JSON.stringify({
                      responce: { status: 400 },
                    })
                  ),
                });
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleRequestFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should parse query params and set userInfo and errorCode', () => {
    component.ngOnInit();

    expect(component.userInfo).toEqual({ responce: { status: 400 } });
    expect(component.errorCode).toBe(400);
  });

  it('should set isOrgAdmin from local storage', () => {
    localStorage.setItem('isOrgAdmin', 'true');

    component.ngOnInit();

    expect(component.isOrgAdmin).toBeTrue();

    localStorage.removeItem('isOrgAdmin');
  });

  it('should navigate back when goBack method is called', () => {
    spyOn(window.history, 'back');

    component.goBack();

    expect(window.history.back).toHaveBeenCalled();
  });

  it('should render the template correctly', () => {
    component.userInfo = { userName: 'test user', response: { status: 400 } };
    component.errorCode = 400;
    component.isOrgAdmin = true;

    fixture.detectChanges();

    const breadcrumbsLink = fixture.nativeElement.querySelector(
      '.govuk-breadcrumbs__link'
    );
    const fleetAcceptParagraph =
      fixture.nativeElement.querySelector('.fleet_accept p');
    const returnToDashboardLink =
      fixture.nativeElement.querySelector('.navigation-text');

    expect(breadcrumbsLink.textContent).toContain('ADMINISTRATOR_DASHBOARD');
    expect(fleetAcceptParagraph.textContent).toContain(
      'The access request for Fleet Portal for user test user has expired or it was already actioned.'
    );
    expect(returnToDashboardLink.getAttribute('routerLink')).toBe('/home');
  });
});
