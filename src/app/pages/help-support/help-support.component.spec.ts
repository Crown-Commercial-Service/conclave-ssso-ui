import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpAndSupportComponent } from './help-support-component';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { TokenService } from 'src/app/services/auth/token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HelpAndSupportComponent', () => {
  let component: HelpAndSupportComponent;
  let fixture: ComponentFixture<HelpAndSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpAndSupportComponent],
      imports: [
        StoreModule.forRoot({}),
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpAndSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show breadcrumbs when authenticated', () => {
    spyOn(component.authService, 'isAuthenticated').and.returnValue(of(true));
    component.ngOnInit();
    fixture.detectChanges();
    const breadcrumbs =
      fixture.nativeElement.querySelector('.govuk-breadcrumbs');
    expect(breadcrumbs).toBeTruthy();
  });

  it('should not show breadcrumbs when not authenticated', () => {
    spyOn(component.authService, 'isAuthenticated').and.returnValue(of(false));
    component.ngOnInit();
    fixture.detectChanges();
    const breadcrumbs =
      fixture.nativeElement.querySelector('.govuk-breadcrumbs');
    expect(breadcrumbs).toBeFalsy();
  });

  it('should display "Page not found" heading', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('Page not found');
  });
});
