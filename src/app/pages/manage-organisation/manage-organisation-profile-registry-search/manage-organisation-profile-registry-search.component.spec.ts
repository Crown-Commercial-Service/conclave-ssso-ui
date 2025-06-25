import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ManageOrganisationRegistrySearchComponent } from './manage-organisation-profile-registry-search.component';
import { ciiService } from 'src/app/services/cii/cii.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Store } from '@ngrx/store';
import { SchemePipe } from 'src/app/pipes/scheme.pipe';

describe('ManageOrganisationRegistrySearchComponent', () => {
  let component: ManageOrganisationRegistrySearchComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistrySearchComponent>;
  let ciiServiceMock: jasmine.SpyObj<ciiService>;
  let sharedDataServiceMock: jasmine.SpyObj<SharedDataService>;

  beforeEach(async () => {
    ciiServiceMock = jasmine.createSpyObj('ciiService', ['getSchemes']);
    sharedDataServiceMock = jasmine.createSpyObj('SharedDataService', [
      'checkBlockedScheme',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
      ],
      declarations: [ManageOrganisationRegistrySearchComponent, SchemePipe],
      providers: [
        { provide: ciiService, useValue: ciiServiceMock },
        { provide: SharedDataService, useValue: sharedDataServiceMock },
        { provide: Store, useFactory: () => ({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistrySearchComponent
    );
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component correctly', () => {
    const schemes = [{ scheme: 'GB-COH', schemeName: 'Companies House' }];
    ciiServiceMock.getSchemes.and.returnValue(of(schemes));

    fixture.detectChanges();

    expect(component.items$).toBeTruthy();
    expect(component.scheme).toEqual('GB-COH');
    expect(component.schemeName).toEqual('Companies House');
  });

  it('should render the template correctly', () => {
    const schemes = [{ scheme: 'GB-COH', schemeName: 'Companies House' }];
    ciiServiceMock.getSchemes.and.returnValue(of(schemes));
    sharedDataServiceMock.checkBlockedScheme.and.returnValue(true);

    fixture.detectChanges();

    const pageTitle = fixture.debugElement.query(
      By.css('.page-title')
    ).nativeElement;
    expect(pageTitle.textContent).toContain('Add new registry');

    const radioItems = fixture.debugElement.queryAll(
      By.css('.govuk-radios__item')
    );
    expect(radioItems.length).toEqual(1);

    const radioLabel = radioItems[0].query(
      By.css('.govuk-radios__label')
    ).nativeElement;
    expect(radioLabel.textContent).toContain('Companies House');

    const textBox = fixture.debugElement.query(
      By.css('.govuk-input')
    ).nativeElement;
    expect(textBox.value).toEqual('');

    const continueButton = fixture.debugElement.query(
      By.css('.govuk-button')
    ).nativeElement;
    expect(continueButton.textContent).toContain('CONTINUE_BTN');
  });

  it('should call onSubmit method when the continue button is clicked', () => {
    spyOn(component, 'onSubmit');

    const schemes = [{ scheme: 'GB-COH', schemeName: 'Companies House' }];
    ciiServiceMock.getSchemes.and.returnValue(of(schemes));
    sharedDataServiceMock.checkBlockedScheme.and.returnValue(true);

    fixture.detectChanges();

    const continueButton = fixture.debugElement.query(
      By.css('.govuk-button')
    ).nativeElement;
    continueButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
  });
});
