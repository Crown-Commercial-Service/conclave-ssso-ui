import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpAndSupportComponent } from './help-support-component';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';

describe('HelpAndSupportComponent', () => {
  let component: HelpAndSupportComponent;
  let fixture: ComponentFixture<HelpAndSupportComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    await TestBed.configureTestingModule({
      declarations: [HelpAndSupportComponent],
      imports: [StoreModule.forRoot({}), BrowserAnimationsModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
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
    authServiceSpy.isAuthenticated.and.returnValue(of(true));
    fixture.detectChanges();
    const breadcrumbs =
      fixture.nativeElement.querySelector('.govuk-breadcrumbs');
    expect(breadcrumbs).toBeTruthy();
  });

  it('should not show breadcrumbs when not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(of(false));
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
