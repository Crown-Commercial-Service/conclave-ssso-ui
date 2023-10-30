import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [HomeComponent],
      providers: [
        { provide: Store, useFactory: () => ({}) },
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct page title', () => {
    const pageTitle = fixture.nativeElement.querySelector('.page-title');
    expect(pageTitle.textContent).toContain(
      'Public Procurement Gateway Dashboard'
    );
  });

  it('should display the organization details', () => {
    component.orgDetails = 'Sample Organization';
    fixture.detectChanges();
    const orgDetails = fixture.nativeElement.querySelector('strong');
    expect(orgDetails.textContent).toContain('Sample Organization');
  });

  it('should render CCS modules correctly', () => {
    component.ccsModules = [
      {
        name: 'CCS Module 1',
        description: 'Module 1 Description',
        route: '/ccs-module1',
      },
      {
        name: 'CCS Module 2',
        description: 'Module 2 Description',
        href: 'https://example.com',
      },
    ];
    fixture.detectChanges();
    const ccsModuleElements = fixture.debugElement.queryAll(
      By.css('.card-title')
    );
    expect(ccsModuleElements.length).toBe(2);
    expect(ccsModuleElements[0].nativeElement.textContent).toContain(
      'CCS Module 1'
    );
    expect(ccsModuleElements[1].nativeElement.textContent).toContain(
      'CCS Module 2'
    );
  });
});
