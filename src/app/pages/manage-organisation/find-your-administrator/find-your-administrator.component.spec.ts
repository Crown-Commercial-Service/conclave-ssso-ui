import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindyouradministratorComponent } from './find-your-administrator.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('FindyouradministratorComponent', () => {
  let component: FindyouradministratorComponent;
  let fixture: ComponentFixture<FindyouradministratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FindyouradministratorComponent],
      providers: [provideRouter([]),],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindyouradministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct breadcrumbs', () => {
    const breadcrumbs = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbs.length).toBe(6);
    expect(breadcrumbs[0].textContent).toContain('REGITERATION_HOME');
    expect(breadcrumbs[1].textContent).toContain('CREATE_ACC');
    expect(breadcrumbs[2].textContent).toContain('ENTER_DETAIL');
    expect(breadcrumbs[3].textContent).toContain('REG_ORG');
    expect(breadcrumbs[4].textContent).toContain('ORG_ADMIN');
    expect(breadcrumbs[5].textContent).toContain('FIND_ADMIN');
  });

  it('should render the correct page title and content', () => {
    const pageTitle = fixture.nativeElement.querySelector('.govuk-heading-xl');
    const content = fixture.nativeElement.querySelector('.govuk-list');
    expect(pageTitle.textContent).toContain('How to find your administrator');
    expect(content.textContent).toContain(
      'the person who gave you your work email account'
    );
  });

  it('should call goBack method when "Go back" button is clicked', () => {
    spyOn(component, 'goBack');
    const backButton = fixture.nativeElement.querySelector('#continueButton');
    backButton.click();
    expect(component.goBack).toHaveBeenCalled();
  });
});
