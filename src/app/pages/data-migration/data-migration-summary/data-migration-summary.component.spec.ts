import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataMigrationSummaryComponent } from './data-migration-summary.component';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('DataMigrationSummaryComponent', () => {
  let component: DataMigrationSummaryComponent;
  let fixture: ComponentFixture<DataMigrationSummaryComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DataMigrationSummaryComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationSummaryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct breadcrumb links', () => {
    const breadcrumbLinks = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbLinks[0].textContent).toContain('ADMINISTRATOR_DASHBOARD');
    expect(breadcrumbLinks[1].textContent).toContain('DATA_MIGRATION');
    expect(breadcrumbLinks[2].textContent).toContain('VIEW_SUMMARY');
  });

  it('should display the correct page title', () => {
    const pageTitle = fixture.nativeElement.querySelector('.page-title');
    expect(pageTitle.textContent).toContain('VIEW_SUMMARY');
  });

  it('should display the correct file validation description', () => {
    const fileValidationDescription =
      fixture.nativeElement.querySelector('.govuk-body-l');
    expect(fileValidationDescription.textContent).toContain(
      'FILE_VALIDATION_DES'
    );
  });

  it('should navigate to the correct routes on link click', () => {
    const dataMigrationLink = fixture.nativeElement.querySelector(
      '.navigation-text[routerLink="/data-migration/upload"]'
    );
    const dashboardLink = fixture.nativeElement.querySelector(
      '.navigation-text[routerLink="/home"]'
    );

    expect(dataMigrationLink).toBeTruthy();
    expect(dashboardLink).toBeTruthy();

    dataMigrationLink.click();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/data-migration/upload');

    dashboardLink.click();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });
});
