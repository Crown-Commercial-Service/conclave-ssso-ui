import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ViewVerifiedOrgComponent } from './view-verified-org.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewVerifiedOrgComponent', () => {
  let component: ViewVerifiedOrgComponent;
  let fixture: ComponentFixture<ViewVerifiedOrgComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of(
        btoa(
          JSON.stringify({
            data: {
              event: {
                organisationId: 'test-org-id',
                organisationName: 'test-name',
              },
            },
          })
        )
      ),
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    await TestBed.configureTestingModule({
      declarations: [ViewVerifiedOrgComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        TranslateService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVerifiedOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to manage-buyer-both when goBack is called from pending-verification route', () => {
    component.routeDetails = { lastRoute: 'pending-verification' };
    component.goBack();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('manage-buyer-both');
  });

  it('should navigate back in history when goBack is called from a different route', () => {
    spyOn(window.history, 'back');
    component.routeDetails = { lastRoute: 'some-other-route' };
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should display the correct organization name in the template', () => {
    component.routeDetails = {
      event: { organisationName: 'Test Organization' },
    };
    fixture.detectChanges();
    const orgName = fixture.nativeElement.querySelector('.govuk-body strong');
    expect(orgName.textContent).toBe('Test Organization');
  });
});
